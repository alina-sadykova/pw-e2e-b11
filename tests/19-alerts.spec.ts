import { expect, test } from "@playwright/test";

test.describe("Alerts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.techglobal-training.com/frontend/alerts");
  });

  test("page.on() with accept", async ({ page }) => {
    // page.on() wait for everything and apply for every alert
    page.on("dialog", async (dialog) => {
      console.log("message:", dialog.message());
      expect(dialog.message()).toBeTruthy();

      await dialog.accept();
    });

    // trigger warning alert
    const alertbuttons = page.locator("[id$='alert']");

    for (let i = 0; i < (await alertbuttons.count()); i++) {
      await alertbuttons.nth(i).click();
      //   await page.waitForTimeout(1000);
    }
  });

  test("page.once()", async ({ page }) => {
    // --------accepts warning alert only
    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toBe(
        "You are on TechGlobal Training application."
      );

      await dialog.accept(); // accept() for warning alert only
    });

    // trigger warning alert
    const alertbuttons = page.locator("[id$='alert']");
    await alertbuttons.first().click();

    await expect(page.locator("#action")).toHaveText(
      "You accepted warning by clicking OK."
    );
    await page.waitForTimeout(1000);

    // ---------- accepts prompt alert without entering text
    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toBe(
        "What would you like to say to TechGlobal?"
      );

      await dialog.accept(); // accept() for confirmation alert only
    });
    // accepts confirmation alert only
    await page.locator("#prompt_alert").click();
    await expect(page.locator("#action")).toHaveText(
      'You entered "" in the alert and clicked OK.'
    );
    await page.waitForTimeout(1000);

    // ---------- accepts prompt alert with entering text
    const text = "Playwright is fun";
    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toBe(
        "What would you like to say to TechGlobal?"
      );
      await dialog.accept(text);
    });
    // accepts confirmation alert only
    await page.locator("#prompt_alert").click();
    await expect(page.locator("#action")).toHaveText(
      `You entered "${text}" in the alert and clicked OK.`
    );
  });

  test("page.on() method with dismiss", async ({ page }) => {
    page.once("dialog", async (dialog) => {
      await dialog.dismiss();
    });

    await page.locator("#confirmation_alert").click();
    await expect(page.locator("#action")).toHaveText(
      "You rejected the alert by clicking Cancel."
    );
  });
});
