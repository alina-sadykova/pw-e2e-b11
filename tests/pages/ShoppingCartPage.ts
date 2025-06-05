import { type Locator, type Page } from "@playwright/test";

interface CourseDetails {
  img: Locator;
  title: string | null;
  tag: string | null;
  price: number;
  discount: number;
}
export class ShoppingCartPage {
  readonly page: Page;
  readonly header: Locator;
  readonly courses: Locator;
  readonly courseImg: Locator;
  readonly courseTitle: Locator;
  readonly companyTag: Locator;
  readonly coursePrice: Locator;
  readonly addButton: Locator;
  readonly discountPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = this.page.locator(".mt-2");
    this.courses = this.page.locator("[id^='course']");
    this.courseImg = this.courses.locator("img");
    this.courseTitle = this.courses.locator("h3");
    this.companyTag = this.page.locator(".my-3");
    this.coursePrice = this.page.locator("[data-testid='full-price']");
    this.discountPrice = this.page.locator("[data-testid='discount']");
    this.addButton = this.courses.locator("button");
  }

  async cickAddButton() {
    await this.addButton.click();
  }

  async getCourseDetails() {
    const coursesList = await this.courses.all();
    const courseDetails: CourseDetails[] = [];

    for (let course of coursesList) {
      const img = course.locator("img");
      const title = await course.locator("h3").textContent();
      const tag = await course.locator(".my-3").textContent();
      const priceText = await course
        .locator("[data-testid='full-price']")
        .textContent();
      const discountText = await course
        .locator("[data-testid='discount']")
        .textContent();
      const price = Number(priceText?.replace(/\d/g, "") || "0");
      const discount = Number(discountText?.replace(/\d/g, "") || "0");
      courseDetails.push({ img, title, tag, price, discount });
    }
    return courseDetails;
  }
}
