import { Locator, chromium, expect, test } from "@playwright/test";

test.skip("Setting a page", async () => {
  // how playwright gets {page} from scratch
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.techglobal-training.com/");
});

test("TC01: Validate Wiki Search", async ({ page }) => {
  /* Go to https://www.wikipedia.org/
    Search for "Playwright"
    Validate the url contains "Playwright"
    Validate the title contains "Playwright"
    Validate the main heading is "Playwright"
    */
  await page.goto("https://www.wikipedia.org/");

  await page.locator("input[name='search']").fill("Playwright");

  await page.getByRole("button", { name: "Search" }).click();

  expect(page.url().endsWith("Playwright")).toBe(true);

  await expect(page).toHaveTitle("Playwright - Wikipedia");

  const header: Locator = page.locator("#firstHeading span");
  await expect(header).toHaveText("Playwright");
});

const dataset: string[] = ["Playwright", "TypeScript", "JavaScript"];

dataset.forEach((data: string) => {
  test(`TC02: Validate Wiki search for ${data}`, async ({ page }) => {
    await page.goto("https://www.wikipedia.org/");

    await page.locator("#searchInput").fill(data);
    await page.locator(".pure-button-primary-progressive").click();

    expect(page.url()).toContain(data);
    expect(await page.title()).toContain(data);
    expect(await page.locator("#firstHeading").innerText()).toBe(data);
  });
});
