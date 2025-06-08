import { expect, test } from "@playwright/test";

test("Evaluate methods", async ({ page }) => {
  await page.goto("https://www.google.com");

  // Playwright
  expect(await page.title()).toBe("Google");
  expect(page.url()).toContain("google");

  // Javascript with evaluate
  const result = await page.evaluate(() => {
    return [document.title, document.URL];
  });
  expect(result[0]).toBe("Google");
  expect(result[1]).toContain("google");
});
