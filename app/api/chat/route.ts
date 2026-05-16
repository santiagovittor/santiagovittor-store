export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import {
  streamText,
  tool,
  stepCountIs,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import type { UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { createHash } from "crypto";
import {
  buildSystemPrompt,
  detectLanguage,
  INJECTION_PATTERNS,
} from "@/lib/gemini";

const UIMessagePartSchema = z
  .object({ type: z.string(), text: z.string().optional() })
  .passthrough();

const UIMessageSchema = z
  .object({
    id: z.string().optional(),
    role: z.enum(["user", "assistant", "system"]),
    parts: z.array(UIMessagePartSchema).min(1),
  })
  .passthrough();

const bodySchema = z.object({
  messages: z.array(UIMessageSchema).min(1).max(20),
  sessionId: z.uuid(),
});

const REFUSAL = {
  en: "I can only chat about Santiago's work. What are you building?",
  es: "Solo puedo hablar del trabajo de Santiago. ¿Qué estás armando?",
};

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { messages, sessionId } = parsed.data;
  const sessionHash = createHash("sha256")
    .update(sessionId)
    .digest("hex")
    .slice(0, 8);

  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  const lastUserText = lastUserMsg
    ? lastUserMsg.parts
        .filter(
          (p): p is { type: "text"; text: string } & Record<string, unknown> =>
            p.type === "text" &&
            typeof (p as Record<string, unknown>).text === "string"
        )
        .map((p) => p.text)
        .join("")
    : "";

  const textCheck = z.string().min(1).max(500).safeParse(lastUserText);
  if (!textCheck.success) {
    return NextResponse.json(
      { errors: textCheck.error.flatten() },
      { status: 400 }
    );
  }

  // Hard truncate as defense-in-depth before any model call
  const truncated = lastUserText.slice(0, 500);
  const lang = detectLanguage(messages);
  const isInjection = INJECTION_PATTERNS.some((pattern) =>
    truncated.toLowerCase().includes(pattern)
  );

  console.log(
    JSON.stringify({
      ts: Date.now(),
      session: sessionHash,
      refusal: isInjection,
      lang,
    })
  );

  if (isInjection) {
    const refusalText = REFUSAL[lang];
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        const id = crypto.randomUUID();
        writer.write({ type: "text-start", id });
        writer.write({ type: "text-delta", id, delta: refusalText });
        writer.write({ type: "text-end", id });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }

  const recentMessages = messages.slice(-10);
  const modelMessages = await convertToModelMessages(
    recentMessages as unknown as Array<Omit<UIMessage, "id">>
  );

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: buildSystemPrompt(lang),
    messages: modelMessages,
    tools: {
      request_booking: tool({
        description:
          "User wants to schedule a call. Call this when the user asks to book, schedule, set up a call, or similar.",
        inputSchema: z.object({}),
        execute: async () => ({ status: "booking_requested" }),
      }),
      submit_contact: tool({
        description:
          "Collect the user's contact details when they want Santiago to follow up by email.",
        inputSchema: z.object({
          name: z.string().min(1),
          email: z.string().email(),
          message: z.string().min(1).max(1000),
        }),
        execute: async (input) => ({ status: "contact_received", ...input }),
      }),
      request_whatsapp_handoff: tool({
        description: "User wants to continue on WhatsApp.",
        inputSchema: z.object({}),
        execute: async () => ({ status: "whatsapp_requested" }),
      }),
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
