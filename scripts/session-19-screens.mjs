import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = path.resolve("session-19-screens");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

await page.goto(BASE, { waitUntil: "networkidle" });
await page.click('button[aria-label*="Open chat"]');
await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
await page.waitForTimeout(700);

const ta = page.locator("textarea.chat-textarea");
await ta.fill("What services do you offer?");
await ta.press("Enter");

// wait for streaming to start then finish
await page.waitForTimeout(1000);
await page.waitForFunction(
  () => !document.querySelector('[aria-label="Processing"]') && document.querySelectorAll('[role="dialog"] span').length > 5,
  { timeout: 30000 }
);
await page.waitForTimeout(800);

await page.screenshot({ path: path.join(OUT, "desktop_1440_transcript.png"), fullPage: false });
console.log("✓ desktop_1440_transcript.png");

await browser.close();
