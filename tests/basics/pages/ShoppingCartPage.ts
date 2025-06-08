import { type Locator, type Page } from "@playwright/test";

interface CourseDetails {
  img: Locator;
  title: Locator;
  titleText: string | null;
  tag: Locator;
  tagText: string | null;
  price: number;
  priceText: string | null;
  priceLocator: Locator;
  discount: number;
  discountLocator: Locator;
  addButton: Locator;
  container: Locator;
}

interface AddedCourseDetails {
  image: Locator;
  titleLocator: Locator;
  titleText: string | null;
  pricetext: string | null;
  discountText: string | null;
  discountLocator: Locator;
  discountAmount: number;
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
  readonly cartContainer: Locator;
  readonly cartHeading: Locator;
  readonly addedCourseContainer: Locator;
  readonly totalPrice: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = this.page.locator(".mt-2");
    this.courses = this.page.locator("[id^='course']");
    this.courseImg = this.courses.locator("img");
    this.courseTitle = this.courses.locator("h3");
    this.companyTag = this.page.locator(".my-3");
    this.coursePrice = this.page.locator("[data-testid='full-price']");
    this.discountPrice = this.page.locator("[data-testid='discount']");
    this.addButton = this.page.getByRole("button", { name: "Add to Cart" });
    this.cartContainer = this.page.locator(".columns").last();
    this.cartHeading = this.page.locator(".mb-2");
    this.addedCourseContainer = this.page.locator(".course-card");
    this.totalPrice = this.page.locator("#total-price");
    this.placeOrderButton = this.page.getByRole("button", {
      name: "Place Order",
    });
  }

  async clickAddButton() {
    await this.addButton.click();
  }

  async getTotalPrice(): Promise<string | null> {
    return await this.totalPrice.textContent();
  }

  async getCourseDetails() {
    const coursesList = await this.courses.all();
    const courseDetails: CourseDetails[] = [];

    for (let course of coursesList) {
      const img = course.locator("img");
      const title = course.locator("h3");
      const titleText = await course.locator("h3").innerText();
      const tag = course.locator(".my-3");
      const tagText = await course.locator(".my-3").innerText();
      const priceText = await course
        .locator("[data-testid='full-price']")
        .textContent();
      const priceLocator = course.locator("[data-testid='full-price']");
      const price = parseFloat(priceText?.replace(/\D/g, "") || "0");
      const discountText = await course.locator("div").last().textContent();
      const discountLocator = course.locator("div").last();
      const discount = parseFloat(discountText?.replace(/\D/g, "") || "0");
      const addButton = course.locator("button");

      courseDetails.push({
        img,
        title,
        titleText,
        tag,
        tagText,
        price,
        priceText,
        priceLocator,
        discount,
        discountLocator,
        addButton,
        container: course,
      });
    }
    return courseDetails;
  }

  async addCourseToCart(courseName: string) {
    const courses = await this.getCourseDetails();

    if (!courseName) {
      throw new Error(`Course name is not provided.`);
    }

    if (courses.length < 1) {
      throw new Error(`There is no such a course available.`);
    }

    const targetTitle = courseName.toLowerCase().replace(/\s+/g, " ").trim();

    for (let course of courses) {
      const availableTitle = course.titleText
        ?.toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

      if (availableTitle?.includes(targetTitle)) {
        await course.container
          .locator("button", { hasText: "Add to Cart" })
          .click();
        return;
      }
    }
    throw new Error(`Course with title "${courseName}" not found.`);
  }

  async getAddedToCartCourseDetails() {
    const addedCourses = await this.addedCourseContainer.all();
    const addedCourseDetails: AddedCourseDetails[] = [];

    for (let addedCourse of addedCourses) {
      const image = addedCourse.locator("img");
      const titleLocator = addedCourse.locator(".course-card-content").first();
      const titleText = await titleLocator.textContent();
      const priceLocator = addedCourse.locator("[data-testid='final-price']");
      const pricetext = await priceLocator.textContent();
      const discountLocator = addedCourse.locator("[data-testid='discount']");
      const discountText = (await discountLocator.count())
        ? await discountLocator.textContent()
        : null;
      const discountAmount = parseFloat(discountText?.match(/\d+/)?.[0] || "0");

      addedCourseDetails.push({
        image,
        titleLocator,
        discountLocator,
        titleText: titleText || "",
        pricetext: pricetext || "",
        discountText: discountText || null,
        discountAmount,
      });
    }

    return addedCourseDetails;
  }
}
