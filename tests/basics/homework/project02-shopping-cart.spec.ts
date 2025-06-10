import { expect, test } from "../../../fixtures/ShoppingCartFixture";

const courses = [
  "SDET Course | Cypress Playwright",
  "Playwright Automation Testing",
  "Cypress Automation Course",
];

test.describe("Shopping Cart Page", () => {
  /* THIS IS BEFORE USING FIXTURES:
  1. beforeEach: get Playwright page and go to the required url;
  2. create a new object using POM and pass page fixture.
  
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "https://www.techglobal-training.com/frontend/shopping-cart"
    );
    shoppingCartPage = new ShoppingCartPage(page);
  });
  */

  test("Test Case 01 - Available Courses Section Validation", async ({
    shoppingCartPage,
  }) => {
    /* Validate the heading is “Available Courses”that there are 3 courses displayed*/
    await expect(shoppingCartPage.header).toHaveText("Available Courses");
    await expect(shoppingCartPage.courses).toHaveCount(3);

    /* Getting list of details for a course*/
    const listOfDetails = await shoppingCartPage.getCourseDetails();

    /* Looping through the list now and validating that each course card has 
    an image, name, TechGlobal School tag, and a price of more than zero*/
    for (const item of listOfDetails) {
      await expect(item.img).toHaveAttribute("src"); // image
      await expect(item.title).toBeVisible(); // title

      expect(item.tagText).toMatch("TechGlobal School"); // tag name

      if (item.price > 0)
        // if there is a price
        await expect(item.priceLocator).toBeVisible();

      /* Validate the first 2 courses have discount tags */
      await expect(listOfDetails[0].discountLocator).toBeVisible();
      await expect(listOfDetails[1].discountLocator).toBeVisible();

      /* Validate that there is an “Add to Cart” button under each course 
      which is displayed, enabled, and has the text “Add to Cart”*/
      await expect(item.addButton).toBeVisible();
      await expect(item.addButton).toHaveText("Add to Cart");
      await expect(item.addButton).not.toHaveAttribute("disabled");
    }
  });

  test("Test Case 02 - Cart Section Validation", async ({
    shoppingCartPage,
  }) => {
    /* Validate the heading is “Items Added to Cart”*/
    await expect(shoppingCartPage.cartHeading).toHaveText(
      "Items Added to Cart"
    );

    /* Validate that the cart is empty by default*/
    await expect(shoppingCartPage.addedCourseContainer).toHaveCount(0);

    /* Validate that the total price is zero “$0” by default*/
    expect(await shoppingCartPage.getTotalPrice()).toContain("$0");

    /* Validate that there is a “Place Order” button is displayed, 
    disabled, and has the text “Place Order”*/
    await expect(shoppingCartPage.placeOrderButton).toBeVisible();
    await expect(shoppingCartPage.placeOrderButton).toHaveAttribute("disabled");
    await expect(shoppingCartPage.placeOrderButton).toHaveText("Place Order");
  });

  test("Test Case 03 - Add a Course to the Cart and Validate", async ({
    shoppingCartPage,
  }) => {
    /* Click on the “Add to Cart” button for one of the courses*/
    await expect(shoppingCartPage.addedCourseContainer).toHaveCount(0);
    await shoppingCartPage.addCourseToCart(courses[0]);
    await expect(shoppingCartPage.addedCourseContainer).toHaveCount(1);

    /* Validate that the course is displayed in the cart with its image, name, and 
    discount amount if available*/
    const addedCourses = await shoppingCartPage.getAddedToCartCourseDetails();

    for (let course of addedCourses) {
      await expect(course.image).toBeVisible();
      await expect(course.titleLocator).toBeVisible();

      if (course.discountText)
        expect(course.discountText).toContain(
          `(${course.discountAmount} % off)`
        );
    }
    /* Validate that the course price is added to the total price excluding the discount amount*/
    const totalCoursePrice = addedCourses.reduce((total, value) => {
      const currentPrice = Number(value.pricetext?.replace(/[^0-9.]/g, ""));
      return total + currentPrice;
    }, 0);
    const totalPrice = Number(
      (await shoppingCartPage.getTotalPrice())?.replace(/[^0-9.]/g, "") || "0"
    );

    expect(totalPrice).toEqual(totalCoursePrice);

    /* Click on the “Place Order” button*/
    await shoppingCartPage.clickPlaceOrderButton();

    /* Validate a success message is displayed with the text “Your order has been placed.”*/
    await expect(shoppingCartPage.successMessage).toBeVisible();

    /* Validate that the cart is empty*/
    await expect(shoppingCartPage.addedCourseContainer).toHaveCount(0);
  });

  test("Test Case 04 - Add Two Courses to the Cart and Validate", async ({
    shoppingCartPage,
  }) => {
    /* Click on the “Add to Cart” button for one of the courses*/
    await expect(shoppingCartPage.addedCourseContainer).toHaveCount(0);
    await shoppingCartPage.addCourseToCart(courses[0]);
    await expect(shoppingCartPage.addedCourseContainer).toHaveCount(1);

    /* Click on the “Add to Cart” button for another course*/
    await expect(shoppingCartPage.addedCourseContainer).toHaveCount(1);
    await shoppingCartPage.addCourseToCart(courses[2]);
    await expect(shoppingCartPage.addedCourseContainer).toHaveCount(2);

    /* Validate that the courses are displayed in the cart with their image, name, and 
    discount amount if available*/
    const addedCourses = await shoppingCartPage.getAddedToCartCourseDetails();

    for (let course of addedCourses) {
      await expect(course.image).toBeVisible();
      await expect(course.titleLocator).toBeVisible();

      if (course.discountText)
        expect(course.discountText).toContain(
          `(${course.discountAmount} % off)`
        );
    }

    /* Validate that the course prices are added to the total price excluding the discount amounts*/
    const totalCoursePrice = addedCourses.reduce((total, value) => {
      const currentPrice = Number(value.pricetext?.replace(/[^0-9.]/g, ""));
      return total + currentPrice;
    }, 0);
    const totalPrice = Number(
      (await shoppingCartPage.getTotalPrice())?.replace(/[^0-9.]/g, "") || "0"
    );
    expect(totalPrice).toEqual(totalCoursePrice);

    /* Click on the “Place Order” button*/
    await shoppingCartPage.clickPlaceOrderButton();

    /* Validate a success message is displayed with the text “Your order has been placed.”*/
    await expect(shoppingCartPage.successMessage).toBeVisible();

    /* Validate that the cart is empt*/
    await expect(shoppingCartPage.addedCourseContainer).toHaveCount(0);
  });

  test("Test Case 05 - Add All Three Courses to the Cart and Validate", async ({
    shoppingCartPage,
  }) => {
    /* Click on the “Add to Cart” button for all three courses*/
    courses.forEach(async (course) => {
      await shoppingCartPage.addCourseToCart(course);
    });

    /* validate all three courses are present*/
    await expect(shoppingCartPage.addedCourseContainer).toHaveCount(
      courses.length - 1
    );

    /* Validate that the courses are displayed in the cart with their image, name, and discount amount if available*/
    const addedCourses = await shoppingCartPage.getAddedToCartCourseDetails();

    for (let course of addedCourses) {
      await expect(course.image).toBeVisible();
      await expect(course.titleLocator).toBeVisible();

      if (course.discountText)
        expect(course.discountText).toContain(
          `(${course.discountAmount} % off)`
        );
    }

    /* Validate that the course prices are added to the total price excluding the discount amounts*/
    const totalCoursePrice = addedCourses.reduce((total, value) => {
      const currentPrice = Number(value.pricetext?.replace(/[^0-9.]/g, ""));
      return total + currentPrice;
    }, 0);
    const totalPrice = Number(
      (await shoppingCartPage.getTotalPrice())?.replace(/[^0-9.]/g, "") || "0"
    );
    expect(totalPrice).toEqual(totalCoursePrice);

    /*  Click on the “Place Order” button*/
    await shoppingCartPage.clickPlaceOrderButton();

    /*  Validate a success message is displayed with the text “Your order has been placed.”*/
    await expect(shoppingCartPage.successMessage).toBeVisible();

    /*  Validate that the cart is empty*/
    await expect(shoppingCartPage.addedCourseContainer).toHaveCount(0);
  });
});
