import { expect, test } from "@playwright/test";

test("Iframe", async ({ page }) => {
  await page.goto("https://www.techglobal-training.com/frontend/iframes");

  const [fname, lname] = ["John", "Doe"];

  const iframeForm = page.frameLocator("#form_frame");
  const nestedFrame = iframeForm.frameLocator("nested");

  await iframeForm.locator("#first_name").fill(fname);
  await iframeForm.locator("#last_name").fill(lname);
  await iframeForm.locator("#submit").click();

  await expect(page.locator("#result")).toHaveText(
    `You entered: ${fname} ${lname}`
  );
});
