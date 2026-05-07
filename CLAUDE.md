# CLAUDE.md — santiagovittor.store

## ⚡ Karpathy Agent Principles (read first, always)

1. **No silent assumptions.** If a requirement is ambiguous, stop and ask. State
   your interpretation before writing code. Wrong assumption caught early = 1 message.
   Wrong assumption caught late = 1 session wasted.

2. **Simplest solution that works.** No premature abstractions, no unrequested
   utilities, no future-proofing. Build exactly what is asked, nothing more.

3. **Minimal diff.** Only touch files directly related to the current task.
   Don't reorganize imports or reformat code in unrelated files.

4. **Define success, then loop until verified.** Every task ends with a check:
   build passes, renders at 3 viewports, typecheck clean. Don't declare done
   without running the verification steps at the bottom of this file.

---

## 🧠 Project

Services site for Santiago Vittor — full-stack dev + AI specialist (Buenos Aires, remote).
Goal: sell services, build credibility, route leads to contact.

**Stack:** Next.js 15 App Router · Tailwind CSS v4 · TypeScript strict · Framer Motion
**Deploy:** Vercel

**Services (source of truth — never invent others):**
- Full-Stack Web Development (React / Next.js / Node.js)
- AI & Chatbot Development (RAG pipelines, LLM workflows, prompt engineering)
- CRM Development (custom lightweight CRMs for small business)
- Digital Ads & Growth (via partner agency dubanronald.com)

---

## 🎨 Design System

**Aesthetic:** Technical Neubrutalism — sharp edges, high contrast, poster-scale
typography. Precision engineering meets editorial design. One unforgettable thing:
the display type dominates every section like a headline.
Not: purple gradients, rounded cards, generic SaaS softness.

**Color tokens — defined once in `globals.css`, used via var() everywhere:**
```css
--bg:       #0A0A0A;
--surface:  #111111;
--border:   #222222;
--accent:   #E8FF00;   /* electric yellow — CTAs */
--accent-2: #FF4D00;   /* burnt orange — hovers */
--text:     #F0EDE6;   /* warm off-white */
--muted:    #555555;
```

**Typography:**
- Display: `Bebas Neue` (Google Fonts) — all-caps, structural, poster weight
- Body: `DM Mono` — technical credibility signal
- Scale: use `clamp()`. Display: `clamp(3rem, 8vw, 7rem)`
- Forbidden: Inter, Roboto, Arial, system-ui as display font

**Motion (Framer Motion):**
- Page load: staggered fade-up, 80ms delay between items, `once: true`
- Card hover: `y: -4px`, border color → `--accent`
- All animations: `prefers-reduced-motion` fallback required
- Forbidden: bounce, spin, parallax on text

---

## 📁 Project Structure

```
/app
  layout.tsx · page.tsx · /contact/page.tsx
/components
  /ui        → Button · Badge · Card
  /sections  → Hero · Services · Projects · About · Contact
  /layout    → Navbar · Footer
/lib
  constants.ts  → services[], navLinks[], socials[]
  metadata.ts   → SEO config
/public/fonts   → self-hosted woff2 (Bebas Neue + DM Mono)
globals.css     → CSS vars + @font-face + base reset
```

Rules: section components = default export. lib files = named exports only.
No inline styles. No `any` type. Images: always `next/image` with explicit dimensions.

---

## 🗂️ Build Order (one section per `/clear`)

| # | Section | Notes |
|---|---------|-------|
| 0 | Foundation | `npm run build` passes, fonts load, CSS vars active |
| 1 | Navbar | Logo + 4 links + "Book a call" CTA button |
| 2 | Hero | Hook headline + subtext + dual CTA + visual anchor |
| 3 | Services | 4-card grid, one card per service |
| 4 | Social proof | 3 stats from FoodStyles + 1 testimonial slot |
| 5 | Projects | RAG Chatbot + Portfolio Chat (link to santiagovittor.com) |
| 6 | About | Short bio paragraph + stack badges |
| 7 | Contact | Form (name / email / message) + WhatsApp link |
| 8 | Footer | Nav links + dubanronald.com mention + copyright |

---

## 🔌 Skills & MCP (install once, before first session)

```bash
# Anthropic's anti-slop frontend design skill
claude plugin add anthropic/frontend-design

# Always-current Next.js 15 / Tailwind v4 / Framer Motion docs
claude mcp add context7 -s user -- npx -y @upstash/context7-mcp@latest

# Screenshot and verify each section visually
claude mcp add playwright -s user -- npx @playwright/mcp@latest
```

Token discipline: skills load ~100 tokens (safe). MCP servers are expensive —
keep max 3 active. Run `/mcp disable <name>` when not needed mid-session.

---

## 🛠️ Commands

```bash
npm run dev           # local dev server
npm run typecheck     # run before every stop
npm run build         # verify before deploying
```

---

## 🚫 Hard Rules

- No lorem ipsum — write real copy from the services list above
- No stock photos — geometric/abstract visuals or real project screenshots only
- No purple gradient hero — it's the most recognizable AI slop tell
- No more than 2 active fonts
- JS bundle must stay under 150KB (check `next build` output)

---

## ✅ Definition of Done (run after every section)

```
[ ] npm run typecheck → zero errors
[ ] Visual check at 390px, 768px, 1440px via Playwright
[ ] No layout shift on load (no CLS)
[ ] prefers-reduced-motion respected
[ ] Real copy in place — no placeholder text
```

---

## 📝 Context Handoff Protocol

When context is filling up:
1. Write `PROGRESS.md` in repo root — what's done, what's next, key decisions
2. Run `/clear`
3. Open new session with: **"Read CLAUDE.md and PROGRESS.md, then continue."**