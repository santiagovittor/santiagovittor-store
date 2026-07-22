# Slice: Analytics Tracking

**Date:** 2026-07-22
**Goal:** Know whether people — especially outreach-link traffic — visit the site. Currently zero visibility.

## Decisions (locked)

- **Two free trackers:** Vercel Web Analytics (cookieless) + GA4 (richer detail).
- **No cookie-consent banner.** Deliberate; GA4 loads unconditionally. Not GDPR-strict — acceptable at current scale.
- **GA4 property:** does not exist yet; created via console (manual).
- **Outreach attribution:** UTM params on signature link, not code.

## Architecture

Both trackers mount once in `app/layout.tsx` (root layout wraps `/` and `/ar` — single insertion covers both locales).

### 1. Vercel Web Analytics
- Package: `@vercel/analytics` (new dep).
- Import: `import { Analytics } from "@vercel/analytics/next";`
- Render `<Analytics />` in `<body>`.
- Enable in Vercel dashboard → project → Analytics tab (one click). Free tier 2.5k events/mo.
- Cookieless → no consent needed. Captures pageviews, referrer, UTM, geo.

### 2. GA4
- Package: `@next/third-parties` (new dep, official Next). Loads gtag via `next/script` — no manual script tag.
- Import: `import { GoogleAnalytics } from "@next/third-parties/google";`
- Env var: `NEXT_PUBLIC_GA_ID` (must be `NEXT_PUBLIC_` — read client-side).
- **Guarded render:** only mount when the env var is set, so local dev and preview deploys stay out of prod data:
  ```tsx
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  // ...in body:
  {gaId && <GoogleAnalytics gaId={gaId} />}
  ```

### Env files
- `.env.local` (gitignored): `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` — real ID, local only.
- `.env.example` (tracked): `NEXT_PUBLIC_GA_ID=` — documents the var.
- Vercel dashboard: add `NEXT_PUBLIC_GA_ID` for Production (and Preview if wanted).

## New dependencies (approved)

- `@vercel/analytics`
- `@next/third-parties`

Both official, zero meaningful runtime cost.

## Outreach attribution (no code)

Both tools auto-capture referrer + UTM query params. Append to the signature link:

```
https://<site>/?utm_source=outreach&utm_medium=email
```

Vary `utm_medium` per channel (`email`, `whatsapp`, `linkedin`). Then filter/segment by source in GA4 (Reports → Acquisition → Traffic acquisition) or Vercel (referrer breakdown).

## Manual steps (user, documented in plan)

1. **GA4:** analytics.google.com → create property → add a Web data stream for the site URL → copy Measurement ID (`G-XXXX`).
2. **Vercel env var:** add `NEXT_PUBLIC_GA_ID` = the ID (Production).
3. **Vercel Analytics:** enable in Analytics tab.
4. **Local:** put the ID in `.env.local`.

## Explicitly skipped (add-later)

- **Cookie-consent banner** — add if EU traffic + GDPR compliance becomes a concern.
- **Custom conversion events** (chat-open, contact-form submit) — high-value upgrade for a client-hunting page; wire via `sendGAEvent` from `@next/third-parties/google`. Not in this slice.
- Self-hosted Plausible / Umami — Vercel Analytics already covers the cookieless niche.

## Files touched

- `package.json` — 2 deps added.
- `app/layout.tsx` — mount both components; read guarded env var.
- `.env.example` — new, documents `NEXT_PUBLIC_GA_ID`.
- `.env.local` — user creates locally (gitignored).

## Verification

- [ ] `npm run typecheck` → zero errors
- [ ] `npm run build` → clean
- [ ] Post-deploy: hit live URL → GA4 Realtime shows 1 active user; Vercel Analytics dashboard logs the visit.
- [ ] UTM test: visit live URL with `?utm_source=outreach` → source appears in GA4 traffic acquisition.
