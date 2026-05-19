/**
 * Mobile QA — Session 7
 * Run: node scripts/mobile-qa.mjs
 * Requires dev server running on http://localhost:3000
 *
 * Tests three chat components at 390 / 768 / 1440 px:
 *   WhatsAppHandoffCard, CalEmbed, ContactConfirmCard
 */

import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = path.resolve("session-7-screens");
const VIEWPORTS = [
  { w: 390, label: "mobile" },
  { w: 768, label: "tablet" },
  { w: 1440, label: "desktop" },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

async function shot(page, name) {
  const dest = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: dest, fullPage: false });
  console.log(`  ✓ ${name}.png`);
}

async function openChat(page) {
  await page.goto(BASE, { waitUntil: "networkidle" });
  // Open chat panel
  await page.click('button[aria-label*="Open chat"]');
  await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
  await page.waitForTimeout(600); // animation
}

async function sendMessage(page, text) {
  const ta = page.locator("textarea.chat-textarea");
  await ta.fill(text);
  await ta.press("Enter");
}

async function waitForAssistant(page, timeoutMs = 30000) {
  // Wait for thinking indicator to appear then disappear
  await page.waitForSelector('[aria-label="Thinking"]', { timeout: 5000 }).catch(() => {});
  await page.waitForFunction(
    () => !document.querySelector('[aria-label="Thinking"]'),
    { timeout: timeoutMs }
  );
  await page.waitForTimeout(300);
}

// ── WhatsApp handoff ───────────────────────────────────────────────────────────
async function testWhatsapp(page, label) {
  console.log(`\n[${label}] WhatsApp handoff`);
  await openChat(page);
  await sendMessage(page, "Can we continue on WhatsApp?");
  await waitForAssistant(page);
  await shot(page, `${label}-whatsapp`);

  // Check for overflow
  const card = page.locator("a").filter({ hasText: /WhatsApp/ }).first();
  const box = await card.boundingBox();
  const panel = page.locator('[role="dialog"]');
  const panelBox = await panel.boundingBox();
  if (box && panelBox) {
    const overflows = box.x + box.width > panelBox.x + panelBox.width + 2;
    console.log(`  width overflow: ${overflows ? "YES ❌" : "no ✓"}`);
    if (overflows) {
      console.log(`  card right edge: ${box.x + box.width}, panel right edge: ${panelBox.x + panelBox.width}`);
    }
  }
}

// ── Cal embed ──────────────────────────────────────────────────────────────────
async function testCal(page, label) {
  console.log(`\n[${label}] Cal embed`);
  await openChat(page);
  await sendMessage(page, "Book a call");
  await waitForAssistant(page, 15000);
  await page.waitForTimeout(1000); // let Cal iframe load
  await shot(page, `${label}-cal`);

  // Check for horizontal scroll on the panel
  const panel = page.locator('[role="dialog"]');
  const hasHScroll = await panel.evaluate((el) => el.scrollWidth > el.clientWidth);
  console.log(`  horizontal scroll: ${hasHScroll ? "YES ❌" : "no ✓"}`);
}

// ── Contact confirm card ───────────────────────────────────────────────────────
async function testContact(page, label) {
  console.log(`\n[${label}] Contact confirm card (long email)`);
  await openChat(page);
  await sendMessage(page, "Can you follow up with me by email?");
  await waitForAssistant(page);
  // Bot asks for name
  await sendMessage(page, "Test User");
  await waitForAssistant(page);
  // Bot asks for email — use a long address
  await sendMessage(page, "very.long.address.for.testing@example-domain.com");
  await waitForAssistant(page, 40000);
  await page.waitForTimeout(500);
  await shot(page, `${label}-contact`);

  // Check for horizontal scroll on the panel
  const panel = page.locator('[role="dialog"]');
  const hasHScroll = await panel.evaluate((el) => el.scrollWidth > el.clientWidth);
  console.log(`  horizontal scroll: ${hasHScroll ? "YES ❌" : "no ✓"}`);
}

// ── Run all viewports ──────────────────────────────────────────────────────────
for (const { w, label } of VIEWPORTS) {
  console.log(`\n=== ${label.toUpperCase()} (${w}px) ===`);
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: 844 });

  await testWhatsapp(page, label);

  // Reload for fresh chat state
  await page.reload({ waitUntil: "networkidle" });
  await testCal(page, label);

  // Reload for fresh chat state
  await page.reload({ waitUntil: "networkidle" });
  await testContact(page, label);

  await page.close();
}

await browser.close();
console.log("\nDone. Screenshots in ./session-7-screens/");
