import { Page, test as base } from "@playwright/test";

import { BackendTestingPage } from "../pages/BackendTestingPage";
import { BasePage } from "../pages/BasePage";
import { FrontendTestingPage } from "../pages/FrontendTestingPage";
import { MockInterviewsLoginPage } from "../pages/MockInterviewsLoginPage";

type PageFixture = {
  basePage: BasePage;
  frontendTestingPage: FrontendTestingPage;
  backendTestingPage: BackendTestingPage;
  mockInterviewsLoginPage: MockInterviewsLoginPage;
  loginPage: Page;
};

export const test = base.extend<PageFixture>({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await page.goto(process.env.baseURL!);

    await use(basePage);

    // run some code after fixture is set
  },

  frontendTestingPage: async ({ basePage }, use) => {
    const frontendTestingPage = new FrontendTestingPage(basePage.page);
    await basePage.selectFrontendOption();

    await use(frontendTestingPage);
  },

  backendTestingPage: async ({ basePage }, use) => {
    const backendTestingPage = new BackendTestingPage(basePage.page);
    await basePage.selectBackendOption();

    await use(backendTestingPage);
  },

  mockInterviewsLoginPage: async ({ basePage }, use) => {
    const mockInterviewsLoginPage = new MockInterviewsLoginPage(basePage.page);
    await basePage.mockInterviewsLink.click();

    await use(mockInterviewsLoginPage);
  },
});

export { expect } from "@playwright/test";
