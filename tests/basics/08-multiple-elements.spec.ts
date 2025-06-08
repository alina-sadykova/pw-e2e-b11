import { expect, test } from "@playwright/test";

test.describe("Playwright Actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.techglobal-training.com/");
  });

  test("Validate navigation headers", async ({ page }) => {
    const headerEl = page.locator('[class*="menus"]>div');

    expect(await headerEl.count()).toBe(3);
    const expectedHeaderTexts = ["Testing", "Exercises", "Mock Interviews"];

    // console.log(await headerEl.first().innerText());
    // console.log(await headerEl.nth(1).innerText());
    // console.log(await headerEl.last().innerText());

    for (let i = 0; i < (await headerEl.count()); i++) {
      expect(await headerEl.nth(i).innerText()).toBe(expectedHeaderTexts[i]);
    }
  });
  test("Validate social media elements in footer", async ({ page }) => {
    /*
    Go to "https://www.techglobal-training.com"
    Validate the footer has 5 social media items
    Each has an href containing "techglobal"
    Each has target attribute equals "_blank"
    */
    // const socialMediaItems = await page
    //   .locator('[class^="Footer_socials"]>a')
    //   .all();
    // expect(socialMediaItems.length).toBe(5);

    // socialMediaItems.forEach((el, index) => {
    //   const hrefAttr = el.getAttribute("href");
    //   const targetAttr = el.getAttribute("target");
    //   expect(hrefAttr).toContain("techglobal");
    //   expect(targetAttr).toBe("_blank");
    // });
    const socialMediaItems = page.locator('[class^="Footer_socials"]>a');
    expect(await socialMediaItems.count()).toBe(5);
    for (let i = 0; i < (await socialMediaItems.count()); i++) {
      const targetAttr = await socialMediaItems.nth(i).getAttribute("target");
      const hrefAttr = await socialMediaItems.nth(i).getAttribute("href");
      expect(targetAttr).toBe("_blank");
      expect(hrefAttr).toContain("techglobal");
    }
  });
});
