import { expect, test } from "@playwright/test";

test.describe("Multiple tabs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "https://www.techglobal-training.com/frontend/multiple-windows"
    );
  });
  test("Example 1", async ({ page }) => {
    const [newPage] = await Promise.all([
      // destructure the array
      page.waitForEvent("popup"), // event to open another window
      page.getByRole("link", { name: "Apple" }).click(), // locate the link/a and click
    ]); // Promise wait for everything to be completed successfully

    console.log(await page.title());
    console.log(page.url());

    await newPage.waitForLoadState("load"); // waits for the new page to finish loading
    console.log("newPage title:", await newPage.title());
    console.log("new url:", newPage.url());

    await page.waitForTimeout(3000);
  });
  test("Example 2", async ({ page }) => {
    // snapshot testing
    await expect(page.locator("#root")).toMatchAriaSnapshot(`
    - list:
      - listitem:
        - link "Apple":
          - /url: https://www.apple.com
      - listitem:
        - link "Microsoft":
          - /url: https://www.microsoft.com
      - listitem:
        - link "Tesla":
          - /url: https://www.tesla.com
    `);

    // open new pages
    const page2 = await page.context().newPage();
    await page2.goto("https://www.carvana.com/");
    expect(page2.getByTitle("Carvana")).toBeVisible();

    const page3 = await page.context().newPage();
    await page3.goto("https://www.npmjs.com/");
    expect(page3.locator("[aria-label='Np']"));

    // await page3.waitForTimeout(1000);

    // go back to page3
    await page2.bringToFront();
    // await page2.waitForTimeout(1000);

    // go back to page
    await page.bringToFront();
    // await page.waitForTimeout(1000);

    // close page 3
    await page3.close();
    // await page.waitForTimeout(1000);

    // close page 2
    await page2.close();
    // await page.waitForTimeout(1000);
  });
});
