# Session 1 Notes — /api/chat endpoint

## Files Created

- `lib/gemini.ts` — system prompt builder, language detection, injection patterns
- `app/api/chat/route.ts` — POST handler with streaming, validation, security, tools

## Decisions Made

### Validation cap (curl test 6)
Chose **400 rejection** via `z.string().min(1).max(500)` on the extracted last user text.
The "hard truncate to 500 chars" in the security section runs after validation as defense-in-depth —
it prevents any edge-case slippage before the model call, not as the primary boundary.
A 600-char message returns `{"errors":{"formErrors":["Too big: expected string to have <=500 characters"]}}`.

### Canned refusal streaming
Used `createUIMessageStream` + `createUIMessageStreamResponse` from `"ai"` v6 with the
`text-start / text-delta / text-end` event sequence. Wire format is identical to the normal
`streamText` path — no drift for `useChat` in Session 2.

### Zod v4 UUID
Used `z.uuid()` (new v4 API) instead of deprecated `z.string().uuid()`. Validates UUID v4 format,
infers to `string` at runtime.

### Message schema cast
`convertToModelMessages` takes `Array<Omit<UIMessage, 'id'>>`. Zod-inferred parts type doesn't
structurally match `UIMessagePart<...>`. Used `as unknown as Array<Omit<UIMessage, 'id'>>` at the
single call site — safe because shape is validated by zod before reaching this point.

### Language detection
Joins `text` fields of parts where `type === "text"` on the **first user message** in the array.
Matches on a list of Spanish signal words. Defaults to `"en"`. Argentine voseo is applied via
the system prompt (`vos tenés, querés, podés`), not by the detector.

### `runtime = "nodejs"`
Explicit — uses `import { createHash } from "crypto"` (Node built-in) and `crypto.randomUUID()`
(Web Crypto global, available in Node 18+).

## Deviations from Prompt

None substantive. Three corrections applied from plan review:
1. Canned refusal uses `createUIMessageStream` (not raw ReadableStream)
2. Message schema uses typed `UIMessageSchema` (not loose `z.record`)
3. Lint skipped this session

## Streaming Shape for Session 2 (useChat wiring)

`POST /api/chat` returns `text/event-stream` SSE in AI SDK v6 UIMessage stream format.

Normal path: `result.toUIMessageStreamResponse()` from `streamText`.
Injection path: same format via `createUIMessageStreamResponse({ stream })`.

Client should use `useChat` from `"ai/react"` with:
```ts
const { messages, input, handleSubmit } = useChat({
  api: "/api/chat",
  body: { sessionId },     // uuid generated once per session, passed in body
});
```

The body schema expects `{ messages: UIMessage[], sessionId: string (uuid) }`.
`useChat` sends messages in the correct `UIMessage[]` shape automatically.

Tool results come back as `tool-output-available` events with:
- `request_booking` → `{ status: "booking_requested" }`
- `submit_contact` → `{ status: "contact_received", name, email, message }`
- `request_whatsapp_handoff` → `{ status: "whatsapp_requested" }`

Session 2: wire up actual Cal.com / Resend in the tool execute handlers.
Session 6: add the chat UI component and connect `useChat`.
