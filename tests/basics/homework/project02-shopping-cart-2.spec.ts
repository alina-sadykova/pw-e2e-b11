import test, { expect } from "playwright/test";

import { ShoppingCartPage2 } from "../../../pages/homework/ShoppingCartPage2";

test.describe("Shopping cart", () => {
  let shoppingCartPage: ShoppingCartPage2;
  test.beforeEach(async ({ page }) => {
    shoppingCartPage = new ShoppingCartPage2(page);
    await page.goto("https://techglobal-training.com/frontend/shopping-cart");
  });
  /**
   * 1. Navigate to https://techglobal-training.com/frontend/shopping-cart.
   * 2. Validate the heading is "Available Courses."
   * 3. Validate that there are 3 courses displayed.
   * 4. Validate that each course has an image, name, TechGlobal School tag, and a price of more than zero.
   * 5. Validate the first 2 courses have discount tags.
   * 6. Validate that there is an "Add to Cart" button under each course which is displayed, enabled, and has the text "Add to Cart."
   */

  test("Test Case 01 - Available Courses Section Validation", async ({
    page,
  }) => {
    await expect(shoppingCartPage.availableCoursesHeader).toHaveText(
      "Available Courses"
    );

    await expect(shoppingCartPage.availableCourses).toHaveCount(3);

    const allCourses = await shoppingCartPage.availableCourses.all();

    for (let course of allCourses) {
      await expect(course.locator("img")).toBeVisible();
      await expect(course.locator("h3")).toBeVisible();
      await expect(course.locator(".my-3")).toHaveText("TechGlobal School");

      const coursePrice = shoppingCartPage.extractNumberFromString(
        await course.locator('[data-testid="full-price"]').textContent()
      );
      expect(coursePrice).toBeGreaterThan(0);

      if (
        (await course.locator("h3").textContent()) !==
        "Cypress Automation Course"
      ) {
        await expect(course.locator('[data-testid="discount"]')).toBeVisible();
      }

      await expect(course.locator("button")).toBeVisible();
      await expect(course.locator("button")).toBeEnabled();
      await expect(course.locator("button")).toHaveText("Add to Cart");
    }
  });

  /**
Navigate to https://techglobal-training.com/frontend/shopping-cart.
Validate the heading is "Items Added to Cart"
Validate that the cart is empty by default
Validate that the total price is zero "$0" by default
Validate that there is a "Place Order" button is displayed, disabled, and has the text "Place Order"
*/
  test("Test Case 02 - Cart Section Validation", async ({ page }) => {
    await expect(shoppingCartPage.cartHeader).toHaveText("Cart");
    await expect(shoppingCartPage.cartSubHeader).toHaveText(
      "Items Added to Cart"
    );

    await expect(shoppingCartPage.itemsInCart).toHaveCount(0);

    const totalPrice = shoppingCartPage.extractNumberFromString(
      await shoppingCartPage.cartPrice.textContent()
    );
    console.log(await shoppingCartPage.cartPrice.textContent());
    console.log(totalPrice);
    expect(totalPrice).toBe(0);

    await expect(shoppingCartPage.placeOrderBtn).toBeVisible();
    await expect(shoppingCartPage.placeOrderBtn).toBeDisabled();
    await expect(shoppingCartPage.placeOrderBtn).toHaveText("Place Order");
  });

  /**
* Navigate to https://techglobal-training.com/frontend/shopping-cart
Click on the "Add to Cart" button for one of the courses
Validate that the course is displayed in the cart with its image, name, and discount amount if available
Validate that the course price is added to the total price excluding the discount amount
Click on the "Place Order" button
Validate a success message is displayed with the text "Your order has been placed."
Validate that the cart is empty
*/
  test("Test Case 03 - Add a Course to the Cart and Validate", async ({
    page,
  }) => {
    await expect(shoppingCartPage.itemsInCart).toHaveCount(0);
    await shoppingCartPage.addCourseToCartByIndex(0);
    await expect(shoppingCartPage.itemsInCart).toHaveCount(1);

    const addedCourse = shoppingCartPage.getCourseByIndex(0);
    const addedCourseName = await addedCourse.locator("h3").textContent();
    const isAddedCourseDiscounted = addedCourse
      .locator('data-testid="discount"')
      .isVisible();

    const courseInCart = shoppingCartPage.getCartCourseByIndex(0);

    await expect(courseInCart.locator("p.has-text-black")).toHaveText(
      addedCourseName
    );

    if (isAddedCourseDiscounted) {
      await expect(
        courseInCart.locator('[data-testid="discount"]')
      ).toBeVisible();
    }

    const listedCoursePrice = shoppingCartPage.extractNumberFromString(
      await addedCourse.locator('[data-testid="full-price"]').textContent()
    );

    let listedDiscountedPercentage = 0;
    if (isAddedCourseDiscounted) {
      listedDiscountedPercentage = shoppingCartPage.extractNumberFromString(
        await addedCourse.locator('[data-testid="discount"]').textContent()
      );
    }

    const expectedTotalPrice = shoppingCartPage.calculateDiscount(
      listedCoursePrice,
      listedDiscountedPercentage
    );
    const actualTotalPrice = shoppingCartPage.extractNumberFromString(
      await shoppingCartPage.cartPrice.textContent()
    );
    expect(actualTotalPrice).toBe(expectedTotalPrice);
  });
});
