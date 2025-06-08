import { expect, test } from "@playwright/test";

test("toPass method", async ({ page }) => {
  await page.goto("https://www.techglobal-training.com/frontend/waits");

  await page.locator("#red").click();
  //   explicit time out:
  await expect(page.locator(".has-background-danger")).toBeVisible({
    timeout: 15000,
  }); // Fails b/c the box displays after 15seconds

  // another way: use to Pass when yohu know element takes more than default time after assertions
  await expect(async () => {
    await expect(page.locator(".has-background-danger")).toBeVisible();
  }).toPass({
    timeout: 15000,
  });
});
