import { expect, test } from "@playwright/test";

test.describe("File Upload and Download", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "https://www.techglobal-training.com/frontend/file-download"
    );
  });
});
