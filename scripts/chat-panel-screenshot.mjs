import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = path.resolve("session-13-screens");

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

await page.goto(BASE, { waitUntil: "networkidle" });
await page.click('button[aria-label*="Open chat"]');
await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
await page.waitForTimeout(600);

const dest = path.join(OUT, "chat_panel_desktop.png");
await page.screenshot({ path: dest, fullPage: false });
console.log(`✓ ${dest}`);

await browser.close();
