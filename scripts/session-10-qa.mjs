/**
 * Session 10 QA — mobile layout fixes on /ar
 * Run: node scripts/session-10-qa.mjs
 * Requires dev server on http://localhost:3000
 *
 * Checks:
 *   1. Glitch label "ASISTENTE 24/7" fully visible at 430px (no viewport overflow)
 *   2. Star trigger clears the WhatsApp sticky bar at 430px
 *   3. Desktop layout (1440px) unchanged
 */

import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = path.resolve("session-10-screens");

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

async function shot(page, name) {
  const dest = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: dest, fullPage: false });
  console.log(`  ✓ ${name}.png`);
}

async function waitForGlitch(page) {
  // Wait 2.5s for glitch animation to auto-start (fires at 2000ms)
  await page.waitForTimeout(2500);
}

async function runChecks(page, label, w) {
  console.log(`\n=== ${label.toUpperCase()} (${w}px) ===`);
  await page.goto(`${BASE}/ar`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500); // isMobile useEffect settles

  // Screenshot before glitch
  await shot(page, `${label}-ar-initial`);

  // Wait for glitch label to appear
  await waitForGlitch(page);
  await shot(page, `${label}-ar-glitch-label`);

  // ── Check 1: glitch label within viewport ───────────────────────────────────
  const labelEl = page.locator('[aria-hidden="true"]').filter({ hasText: /ASISTENTE|ASK MY AI/ }).first();
  const labelBox = await labelEl.boundingBox().catch(() => null);
  if (labelBox) {
    const overflowsLeft = labelBox.x < 0;
    const overflowsRight = labelBox.x + labelBox.width > w;
    console.log(`  label x: ${labelBox.x.toFixed(1)}, width: ${labelBox.width.toFixed(1)}`);
    console.log(`  label left overflow:  ${overflowsLeft  ? "YES ❌" : "no ✓"}`);
    console.log(`  label right overflow: ${overflowsRight ? "YES ❌" : "no ✓"}`);
  } else {
    console.log("  label not yet visible (phase not reached) — check screenshot");
  }

  // ── Check 2: star clears WhatsApp bar ──────────────────────────────────────
  // Scroll past hero to trigger StickyWhatsApp
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(400);
  await shot(page, `${label}-ar-sticky-bar`);

  const starBtn = page.locator('button[aria-label*="chat"]').first();
  const starBox = await starBtn.boundingBox().catch(() => null);

  // WhatsApp bar is the fixed bottom link
  const waBar = page.locator('a[aria-label*="WhatsApp"]').first();
  const waBox = await waBar.boundingBox().catch(() => null);

  if (starBox && waBox) {
    const vh = page.viewportSize().height;
    const starBottom = vh - starBox.y;            // distance from bottom of viewport
    const barTop = vh - waBox.y;                  // distance from bottom of viewport
    const gap = starBottom - barTop;              // negative = collision
    console.log(`  star bottom from vp bottom:    ${starBottom.toFixed(1)}px`);
    console.log(`  wa bar top from vp bottom:     ${barTop.toFixed(1)}px`);
    console.log(`  clearance: ${gap.toFixed(1)}px  ${gap >= 8 ? "✓" : "❌ collision"}`);
  } else {
    console.log("  could not measure positions — check screenshot");
  }
}

// 430px mobile
const mobilePage = await browser.newPage();
await mobilePage.setViewportSize({ width: 430, height: 932 });
await runChecks(mobilePage, "mobile-430", 430);
await mobilePage.close();

// 1440px desktop — verify no regression
const desktopPage = await browser.newPage();
await desktopPage.setViewportSize({ width: 1440, height: 900 });
await runChecks(desktopPage, "desktop-1440", 1440);
await desktopPage.close();

await browser.close();
console.log(`\nDone. Screenshots in ./session-10-screens/`);
