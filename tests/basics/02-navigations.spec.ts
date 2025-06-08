import { expect, test } from "@playwright/test";

test.describe("Playwright Navigations", () => {
  test("TC01: Validate url and title", async ({ page }) => {
    await page.goto("https://www.google.com/");
    expect(page.url()).toBe("https://www.google.com/");
    expect(await page.title()).toBe("Google");

    await page.goto("https://www.apple.com/");
    expect(page.url()).toContain("apple");
    expect(await page.title()).toBe("Apple");
  });
  test("TC02: validate browser navigation", async ({ page }) => {
    await page.goto("https://www.google.com/");
    await page.goto("https://www.apple.com/");

    // refresh
    await page.reload();

    // navigate back to google
    await page.goBack();

    // navigate forward to apple
    await page.goForward();
  });
});
