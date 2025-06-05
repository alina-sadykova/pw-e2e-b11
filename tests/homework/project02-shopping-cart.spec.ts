import { expect, test } from "@playwright/test";

import { ShoppingCartPage } from "../pages/ShoppingCartPage";

let shoppingCartPage: ShoppingCartPage;

test.describe("Shopping Cart Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "https://www.techglobal-training.com/frontend/shopping-cart"
    );
    shoppingCartPage = new ShoppingCartPage(page);
  });

  test("Test Case 01 - Available Courses Section Validation", async () => {
    /*Validate the heading is “Available Courses”
Validate that there are 3 courses displayed
Validate that each course has an image, name, TechGlobal School tag, and a price of more than zero
Validate the first 2 courses have discount tags
Validate that there is an “Add to Cart” button under each course which is displayed, enabled, and has the text “Add to Cart” */
    await expect(shoppingCartPage.header).toHaveText("Available Courses");

    await expect(shoppingCartPage.courses).toHaveCount(3);

    const listOfDetails = await shoppingCartPage.getCourseDetails();

    for (let course of listOfDetails) {
      console.log(course);
    }
  });
});
