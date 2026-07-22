# santiagovittor.com

Personal services site. Built to convert, not to impress other developers.

**Live:** [santiagovittor.com](https://santiagovittor.com)

---

## What it does

Bilingual services site (EN at `/`, Argentine Spanish at `/ar`) with an embedded AI assistant that qualifies leads, books calls via Cal.com, collects contact requests via Resend, and hands off to WhatsApp. All three flows are tool-routed through a single streaming chat endpoint.

---

## Stack

- **Next.js 15** App Router, TypeScript strict
- **Tailwind CSS v4** CSS-first token system
- **Framer Motion** for entrance and interaction animations
- **Vercel AI SDK v6** streaming with tool use
- **Gemini 3.5 Flash** via `@ai-sdk/google`
- **Cal.com** inline embed via `@calcom/embed-react`
- **Resend** for transactional email on contact submissions
- **@flodlc/nebula** for the cosmic starfield background

---

## Architecture notes

The AI assistant lives entirely in `components/ChatAssistant.tsx` (single client component, all UI co-located) and talks to `app/api/chat/route.ts`. The route handles:

- Zod validation of the incoming UIMessage shape
- Injection pattern matching before the model sees the message
- A tool-safe sliding 10-turn window that never orphans a function call turn
- Three tools: `request_booking`, `submit_contact`, `request_whatsapp_handoff`
- Language detection driving the bilingual system prompt in `lib/gemini.ts`

Both routes live under the same Next.js deployment. No separate backend.

---

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev
```

Required env vars:

```
GOOGLE_GENERATIVE_AI_API_KEY=
RESEND_API_KEY=
```

---

## Scripts

```bash
npm run typecheck              # TypeScript strict check
npm run build                  # production build
node scripts/test-chat.mjs     # smoke test the chat API against saved vectors
node scripts/mobile-qa.mjs     # Playwright screenshots at 390/768/1440px
```

---

## Project structure

```
app/
  api/chat/route.ts        streaming chat endpoint
  page.tsx                 EN landing
  ar/page.tsx              ES landing
components/
  ChatAssistant.tsx        AI chat UI — trigger, portal, transcript, tool cards
lib/
  gemini.ts                system prompt builder, tool definitions, injection patterns
  constants.ts             site-wide constants
scripts/
  test-chat.mjs            API smoke tester
  mobile-qa.mjs            Playwright QA harness
```

---

## Design

Tactile cosmic brutalism. `#0A0A0A` background, `#E8FF00` as the only chromatic element, Bebas Neue display type, DM Mono body. Sharp 1px borders throughout, no glassmorphism except a subtle blur on the chat panel.