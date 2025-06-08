import { chromium } from "@playwright/test";

// this will run once after execution
async function globalTeardown() {
  // set browser -> new CONTEXT -> PAGE
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://playwright.dev/");

  await page.waitForTimeout(3000);

  console.log("this is GLOBAL TEARDOWN running");

  // Delete all the cookies
}
export default globalTeardown;
