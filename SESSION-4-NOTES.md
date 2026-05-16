# Session 4 Notes — Cal.com Inline Booking Embed

## @calcom/embed-react API Used

**Version:** 1.5.3

**Component:** `Cal` (default export from `@calcom/embed-react`)
**Initializer:** `getCalApi` (named export)

**Props used:**
```tsx
<Cal
  calLink="santiago-vittor-4ozbwu/30min"
  config={{
    theme: "dark",
    layout: "column_view",
  }}
  style={{ width: "100%", height: "600px", border: "1px solid var(--accent)" }}
/>
```

**getCalApi pattern:**
```typescript
useEffect(() => {
  (async () => {
    const cal = await getCalApi();
    cal("ui", { theme: "dark" });
  })();
}, []);
```

**Dropped:** `config.styles.branding.brandColor` — TypeScript rejected `{ branding: { brandColor: string } }` for the `styles` field (typed as `string | string[] | Record<string, string>`). Dark theme is applied via `config.theme: "dark"` and `cal("ui", { theme: "dark" })`. Brand color not applied this session.

**Layout:** `"column_view"` — shows available time slots in a vertical list (no full calendar grid). Correct choice for 420px panel width.

**SSR:** Static import works. `ChatAssistant.tsx` is `"use client"` so no SSR execution.

## Exact AI SDK v6 Tool-Part Type String

Confirmed from `node_modules/ai/src/ui/ui-messages.ts`:

- Pattern: `` `tool-${toolName}` `` for static tool parts
- For `request_booking` tool: **`"tool-request_booking"`**
- State values: `"input-streaming" | "input-available" | "output-available" | "output-error"`
- Part fields: `type`, `state`, `toolName`, `input`, `output`

`LoosePart` (`{ type: string; [k: string]: unknown }`) covers this — `.state` access returns `unknown`, valid for `=== "output-error"` comparison.

## System Prompt Changes

**Deploy decision:** Session 4 pushes to Vercel before Session 5. `submit_contact` and `request_whatsapp_handoff` stubs are not wired yet. The system prompt is **temporarily scoped** to one active tool: `request_booking`. For follow-up emails and WhatsApp, the bot directs users to WhatsApp directly (not via tool).

**EN prompt:** Replaced the three-tool routing line with a scoped "Actions" block forbidding fabricated email/follow-up claims and requiring immediate `request_booking` on any booking phrase.

**ES prompt:** Same in voseo Argentine Spanish.

Both marked with: `// Session 5: restore full three-tool routing`

## Deviations from Prompt

1. **Brand color not applied** — `config.styles.branding.brandColor` is not in the TypeScript type for `styles`. Dropped from both `config` prop and `cal("ui", ...)` call. Dark theme still applied. Cal.com may accept it at runtime via looser JS types, but TypeScript rejects it at build time.

2. **`getCalApi` not dynamic-imported** — Plan noted a fallback to `next/dynamic` if build failed. Build passed with static import, so the fallback was not needed.

## What Session 5 Needs to Know

Session 5 wires `submit_contact` (Resend email) and `request_whatsapp_handoff` (open WhatsApp link). The tool-part rendering pattern is established in `ChatAssistant.tsx`: inside `messages.map()`, detect parts by `type === "tool-{toolName}"` (e.g., `"tool-submit_contact"`, `"tool-request_whatsapp_handoff"`), then render the appropriate UI below the assistant text in the column div. For `submit_contact`, show a confirmation message once `state === "output-available"`. For `request_whatsapp_handoff`, render a styled WhatsApp link using `SITE.whatsapp`. Both tool types should follow the same column-div structure as the booking embed: `▸` prefix on the left, content column on the right. Session 5 must also restore the full three-tool routing in `lib/gemini.ts` (both EN and ES) — the current scoped prompt only routes to `request_booking`. The scoped lines are clearly commented for easy replacement.
