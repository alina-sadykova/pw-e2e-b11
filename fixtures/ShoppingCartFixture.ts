import { test as base, expect } from "@playwright/test";

import { ShoppingCartPage } from "../pages/homework/ShoppingCartPage";

type ShoppingCartFixture = {
  shoppingCartPage: ShoppingCartPage;
};

// We're re-identifiying Playwright test with an additional shoppingCartPage fixture
export const test = base.extend<ShoppingCartFixture>({
  shoppingCartPage: async ({ page }, use) => {
    const shoppingCartPage = new ShoppingCartPage(page);
    await page.goto(
      "https://www.techglobal-training.com/frontend/shopping-cart"
    );
    await use(shoppingCartPage);
  },
});
export { expect };
