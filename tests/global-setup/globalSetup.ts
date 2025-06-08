import { chromium } from "@playwright/test";

// this will run once before execution
async function globalSetup() {
  // set browser -> new CONTEXT -> PAGE
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://playwright.dev/");

  await page.waitForTimeout(2000);

  console.log("this is GLOBAL SETUP running");

  // Loging and store auth state
}
export default globalSetup;
