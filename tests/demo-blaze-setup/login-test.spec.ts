import { expect, test } from "@playwright/test";

// to overwrite config for this specific file:
// test.use({
//   headless: false,
//   viewport: {
//     height: 1080,
//     width: 1920,
//   },
// });

test("Login", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Log in" }).click();
  await page.locator("#loginusername").fill("test");
  await page.locator("#loginpassword").fill("test");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByRole("link", { name: "Log out" })).toBeVisible();

  // Create & Save auth storage state
  await page.context().storageState({ path: "./tests/auth/demo-blaze.json" });
});
