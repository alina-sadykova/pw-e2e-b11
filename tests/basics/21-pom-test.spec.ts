import { expect, test } from "@playwright/test";

import { BackendTestingPage } from "../../pages/BackendTestingPage";
import { FrontendTestingPage } from "../../pages/FrontendTestingPage";
import dotenv from "dotenv";
/* path is used for CI/CDprocesses */
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const frontendPracticePageTexts: string[] = [
  "HTML Elements",
  "Dynamic Elements",
  "Waits",
  "Dropdowns",
  "Alerts",
  "IFrames",
  "Multiple Windows",
  "Tables",
  "File Download & Upload",
  "Actions",
];

test.describe("POM Testing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.techglobal-training.com/");
    // 1 - Pullign URL from config file use.baseURL
    // await page.goto("/");

    // 2 - Pulling URL from env file and warpping in `` to avoid type error
    // await page.goto(`${process.env.baseURL}`);
    // console.log(page.url());
  });

  frontendPracticePageTexts.forEach((frontendPracticePageText) => {
    test(`Validate Frontend Testing "${frontendPracticePageText}" Page loading`, async ({
      page,
    }) => {
      const frontendTestingPage = new FrontendTestingPage(page);

      await frontendTestingPage.selectFrontendOption();

      await frontendTestingPage.clickOnPracticeCard(frontendPracticePageText);
      await frontendTestingPage.wait(0.5);

      expect(page.url()).toContain(
        frontendPracticePageText.replaceAll(" ", "-").toLowerCase()
      );
    });
  });

  test("Validate Backend Testing adding new student", async ({ page }) => {
    const backendTestingPage = new BackendTestingPage(page);

    const ran: number = Math.ceil(Math.random() * 1000000);

    await backendTestingPage.selectBackendOption();
    await backendTestingPage.fillStudentFormAndSubmit(
      "Alex",
      "Smith",
      `alex${ran}@gmail.com`,
      "2000-10-10",
      "Sofia Alvarado"
    );

    await expect(backendTestingPage.successMessage).toBeVisible();

    await backendTestingPage.wait(3);
  });
});
