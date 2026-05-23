# Session 12 Notes

## Bug

Cold-start tool-trigger message (e.g. "book a meeting" as the very first message)
returned an empty text response. Same message worked after any prior exchange.

## Root cause

`thinkingBudget: 0` in `providerOptions.google.thinkingConfig` disabled Gemini thinking entirely.

Without thinking and without conversation history, Gemini cannot reliably select tools —
it either skips the tool call or returns empty. With prior exchange, existing
tool-invocation examples in the message history guide it even with thinking disabled.

## Step-count analysis

| Step | Action |
|------|--------|
| 1 | Model receives user message, returns tool call |
| — | SDK executes tool server-side |
| 2 | Model receives tool result, returns acknowledgment text |

Total: 2 model calls. `stopWhen: stepCountIs(5)` allows up to 5 — not the bug.

## Fix applied (Session 12 part 1)

Removed `providerOptions` block from `streamText` call in `app/api/chat/route.ts`.
Gemini now uses its default thinking level (medium), which is sufficient for reliable
cold-start tool routing.

## Files changed (Session 12 part 1)

- `app/api/chat/route.ts` — removed `providerOptions` block
- `scripts/test-chat.mjs` — added `V-BOOKING-1` cold-start booking test vector

---

## Bug (Session 12 part 2)

`AI_APICallError 400 "function call turn comes immediately after a user turn"` —
Gemini rejects requests where the first message in the conversation window is an
assistant tool-call with no preceding user turn.

## Root cause

`messages.slice(-10)` at line 118 cuts conversation history naively. When a tool
exchange (assistant tool-call + tool result) lands at the slice boundary, the window
starts with an orphaned assistant message containing a tool-call, and Gemini rejects it.

## How `convertToModelMessages` shapes the array

A single UIMessage from the frontend with `type: "tool-invocation"` parts (state:
"result") becomes **two** CoreMessages after `convertToModelMessages`:
1. `role: "assistant"`, content includes `{type: "tool-call", ...}`
2. `role: "tool"`, content includes `{type: "tool-result", ...}`

So the pair to drop at the head of the window is always: assistant (tool-call) + tool (result).

## Fix applied (Session 12 part 2)

Added a tool-safe trim loop **after** `convertToModelMessages` and **before** `streamText`,
operating on `modelMessages` (CoreMessage[]). Walks forward from index 0, dropping any
leading assistant tool-call + following tool messages until the window starts with `role: "user"`.

Handles:
- 0 tool exchanges at head (first message is user → break immediately, no trimming)
- 1 tool exchange at head (skip assistant + tool, land on user)
- 2+ tool exchanges at head (loop repeats)
- Orphaned leading tool message without preceding assistant (fallthrough `windowStart++`)

Window size (10) unchanged. `stepCountIs`, tools, system prompt, and all other logic unchanged.

## Files changed (Session 12 part 2)

- `app/api/chat/route.ts` — added `windowStart` trim loop between `convertToModelMessages` and `streamText`

## Verification

```bash
# Terminal 1
npm run dev

# Terminal 2
node scripts/test-chat.mjs
```

Expected sequence to test:
1. Cold-start: "book a meeting" → tool fires, Cal embed renders (no 400)
2. Follow-up: "thanks" → normal text response
3. Second tool: "actually let me leave my email" → `submit_contact` tool fires (no 400)

All test vectors in `scripts/test-chat.mjs` must pass.

```bash
pnpm typecheck   # exits 0 ✓
pnpm build       # exits clean ✓
```
