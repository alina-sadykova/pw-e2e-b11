import { expect, test } from "@playwright/test";

// using codegen
test("test", async ({ page }) => {
  await page.goto("https://www.amazon.com/");
  await page.getByRole("searchbox", { name: "Search Amazon" }).click();
  await page
    .getByRole("searchbox", { name: "Search Amazon" })
    .fill("macbook pro");
  await page.getByRole("button", { name: "Go", exact: true }).click();
  await page.locator("#a-autoid-1-announce").click();
  await page.getByRole("link", { name: "item in cart" }).click();
  await page
    .getByRole("button", { name: "Proceed to checkout Check out" })
    .click();
  await expect(
    page
      .locator("#authportal-center-section div")
      .filter({ hasText: "Sign in or create account" })
      .nth(2)
  ).toBeVisible();
});
