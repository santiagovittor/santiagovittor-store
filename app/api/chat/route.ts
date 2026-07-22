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
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";
import { createHash } from "crypto";
import { Resend } from "resend";
import {
  buildSystemPrompt,
  detectLanguage,
  INJECTION_PATTERNS,
} from "@/lib/gemini";

const resend = new Resend(process.env.RESEND_API_KEY);

const nvidia = createOpenAICompatible({
  name: "nvidia",
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY ?? "",
});

// Primary: Gemini 2.5 Flash (free). thinkingBudget:0 is required — with thinking on
// it returns empty completions on booking-intent turns instead of calling the tool.
// Best on the hardened prompt: refuses injection/leak, clean voice, reliable tools.
// Fallback: NVIDIA NIM gpt-oss-20b (free, cross-provider) when Gemini 4xx/5xx/times out.
//   Weaker at persona/injection, but only runs when Gemini is down; submit_contact
//   emails a hardcoded owner address, so worst case is owner-spam, not exfiltration.
// gemini-3.5-flash removed — it 503s under load and hangs the chat.
const MODEL_CHAIN = [
  google("gemini-2.5-flash"),
  nvidia("openai/gpt-oss-20b"),
];

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
  en: "I only talk about my work. What are you building?",
  es: "Solo hablo de mi trabajo. ¿Qué estás armando?",
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

  // Drop orphaned tool-call/result pairs from the head of the window.
  // Gemini rejects when first turn is an assistant tool-call with no preceding user turn.
  let windowStart = 0;
  while (windowStart < modelMessages.length) {
    const m = modelMessages[windowStart];
    if (m.role === "user") break;
    if (m.role === "assistant") {
      const parts = Array.isArray(m.content) ? m.content : [];
      const hasToolCall = parts.some(
        (p) =>
          typeof p === "object" &&
          p !== null &&
          "type" in p &&
          (p as { type: string }).type === "tool-call"
      );
      if (hasToolCall) {
        windowStart++;
        while (
          windowStart < modelMessages.length &&
          modelMessages[windowStart].role === "tool"
        )
          windowStart++;
        continue;
      }
    }
    windowStart++;
  }
  const safeModelMessages = modelMessages.slice(windowStart);

  const tools = {
    request_booking: tool({
      description:
        "User wants to schedule a call. Call this when the user asks to book, schedule, set up a call, or similar.",
      inputSchema: z.object({}),
      execute: async () => ({ status: "booking_requested" }),
    }),
    submit_contact: tool({
      description:
        "User wants Santiago to follow up by email. Call this when user says: 'leave my email', 'have him email me', 'follow up by email', 'dejame el mail', 'que me escriba', or any email follow-up request. Collect name and email first, then call immediately.",
      inputSchema: z.object({
        name: z.string().min(1),
        email: z.string().email(),
        message: z.string().min(1).max(1000),
      }),
      execute: async (input) => {
        const { name, email, message } = input;
        try {
          await resend.emails.send({
            from: "Contact Form <onboarding@resend.dev>",
            to: "svittordev@gmail.com",
            subject: `New chat contact: ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          });
          return { status: "contact_received", email };
        } catch {
          return { status: "contact_error" };
        }
      },
    }),
    request_whatsapp_handoff: tool({
      description:
        "User wants to continue on WhatsApp. Call this when user says: 'WhatsApp', 'text me', 'message me', 'mensajeáme', 'por WhatsApp', or any async messaging request.",
      inputSchema: z.object({}),
      execute: async () => ({ status: "whatsapp_requested" }),
    }),
  };

  const system = buildSystemPrompt(lang);

  // Buffer-then-emit so a provider failure surfaces as a catchable error
  // (not a swallowed hang) and we can fail over. Replies are tiny + sub-second,
  // so buffering is imperceptible and toUIMessageStream still replays tool parts.
  // ponytail: on a mid-stream failure after submit_contact's email already sent,
  // the fallback could re-send. Rare enough to accept; revisit if it ever recurs.
  for (const model of MODEL_CHAIN) {
    let capturedError: unknown;
    const result = streamText({
      model,
      system,
      messages: safeModelMessages,
      tools,
      stopWhen: stepCountIs(5),
      maxRetries: 1,
      providerOptions: {
        google: { thinkingConfig: { thinkingBudget: 0 } },
      },
      onError: (e) => {
        capturedError = (e as { error?: unknown })?.error ?? e;
      },
    });
    await result.consumeStream();
    if (capturedError) continue;
    return result.toUIMessageStreamResponse();
  }

  return NextResponse.json(
    { error: "AI temporarily unavailable" },
    { status: 503 }
  );
}
