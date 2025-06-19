import { Locator, type Page } from "playwright/test";

export class ShoppingCartPage2 {
  readonly page: Page;
  readonly availableCoursesHeader: Locator;
  readonly availableCourses: Locator;
  readonly cart: Locator;
  readonly cartHeader: Locator;
  readonly cartSubHeader: Locator;
  readonly itemsInCart: Locator;
  readonly cartPrice: Locator;
  readonly placeOrderBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.availableCoursesHeader = page.locator("h1.mt-2");
    this.availableCourses = page.locator('[id^="course-"]');
    this.cart = page.locator(".columns .is-half");
    this.cartHeader = this.cart.locator("h1");
    this.cartSubHeader = this.cart.locator(".mb-2");
    this.itemsInCart = this.cart.locator(".course-card");
    this.cartPrice = this.cart.locator("#total-price");
    this.placeOrderBtn = this.cart.locator("button");
  }

  getCourseByIndex(index: number): Locator {
    return this.availableCourses.nth(index);
  }

  getCartCourseByIndex(index: number): Locator {
    return this.itemsInCart.nth(index);
  }

  extractNumberFromString(str: string): number {
    return Number(str.replace(/[^0-9]/g, ""));
  }

  async addCourseToCartByIndex(index: number) {
    await this.getCourseByIndex(index).locator("button").click();
  }

  calculateDiscount(price: number, percentOff: number): number {
    const discountedPrice = price * (percentOff / 100);

    return price - discountedPrice;
  }
}
