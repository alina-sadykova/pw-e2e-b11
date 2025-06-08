import { expect, test } from "@playwright/test";

import { ShoppingCartPage } from "../pages/ShoppingCartPage";

let shoppingCartPage: ShoppingCartPage;

const carts = [
  "SDET Course | Cypress Playwright",
  "Playwright Automation Testing",
  "Cypress Automation Course",
];

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

    for (let i = 0; i < listOfDetails.length; i++) {
      await expect(listOfDetails[i].img).toHaveAttribute("src");

      await expect(listOfDetails[i].title).toBeVisible();

      expect(listOfDetails[i].titleText?.trim()).toContain(
        carts[i].split("|")[0].trim()
      );

      expect(listOfDetails[i].tagText).toMatch("TechGlobal School");

      if (listOfDetails[i].price > 0)
        await expect(listOfDetails[i].priceLocator).toBeVisible();

      await expect(listOfDetails[0].discountLocator).toBeVisible();
      await expect(listOfDetails[1].discountLocator).toBeVisible();

      await expect(listOfDetails[i].addButton).toBeVisible();
      await expect(listOfDetails[i].addButton).toHaveText("Add to Cart");
      await expect(listOfDetails[i].addButton).not.toHaveAttribute("disabled");
    }
  });

  test("Test Case 02 - Cart Section Validation", async () => {
    /*Validate the heading is “Items Added to Cart”
    Validate that the cart is empty by default
    Validate that the total price is zero “$0” by default
    Validate that there is a “Place Order” button is displayed, 
    disabled, and has the text “Place Order”*/

    await expect(shoppingCartPage.cartHeading).toHaveText(
      "Items Added to Cart"
    );
    await expect(shoppingCartPage.addedCourseContainer).toHaveCount(0);

    expect(await shoppingCartPage.getTotalPrice()).toContain("$0");

    await expect(shoppingCartPage.placeOrderButton).toBeVisible();
    await expect(shoppingCartPage.placeOrderButton).toHaveAttribute("disabled");
    await expect(shoppingCartPage.placeOrderButton).toHaveText("Place Order");
  });
  test("Test Case 03 - Add a Course to the Cart and Validate", async () => {
    /*Click on the “Add to Cart” button for one of the courses
    Validate that the course is displayed in the cart with its image, name, and discount amount if available
    Validate that the course price is added to the total price excluding the discount amount
    Click on the “Place Order” button
    Validate a success message is displayed with the text “Your order has been placed.”
    Validate that the cart is empty*/
    await expect(shoppingCartPage.addedCourseContainer).toHaveCount(0);

    await shoppingCartPage.addCourseToCart(carts[0]);

    await expect(shoppingCartPage.addedCourseContainer).toHaveCount(1);

    const addedCourses = await shoppingCartPage.getAddedToCartCourseDetails();

    for (let course of addedCourses) {
      await expect(course.image).toBeVisible();
      await expect(course.titleLocator).toBeVisible();
      if (course.discountText)
        expect(course.discountText).toContain(
          `(${course.discountAmount} % off)`
        );
    }
  });
});
