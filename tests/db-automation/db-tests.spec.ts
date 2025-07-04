import { expect, test } from "@playwright/test";

import AxeBuilder from "@axe-core/playwright"; // 1
import { BackendTestingPage } from "../../pages/BackendTestingPage";
import { executeQuery } from "../../utils/dbUtils";
import { faker } from "@faker-js/faker";

test.describe("DB Query Verification", () => {
  test("Get all instructors", async () => {
    const result = await executeQuery("SELECT * FROM instructors");
    console.table(result);

    expect(result.length).toBe(4);
  });

  test("Get all students", async () => {
    const result = await executeQuery("SELECT * FROM students");
    console.table(result);
    expect(result.length).toBeGreaterThanOrEqual(2);
  });
});

test.describe("UI - DB E2E Tests", () => {
  let backendTestingPage: BackendTestingPage;

  test.beforeEach(async ({ page }) => {
    backendTestingPage = new BackendTestingPage(page);
    await page.goto("https://www.techglobal-training.com/backend");
  });

  test("E2E test with UI and DB interaction/UI and API integration testing ", async ({
    page,
  }) => {
    const userToAdd = {
      fname: faker.person.firstName(),
      lname: faker.person.lastName(),
      email: faker.internet.email(),
      dob: faker.date.birthdate().toISOString().split("T")[0],
      instructorName: "Leyla Haddad",
    };

    backendTestingPage.fillStudentFormAndSubmit(
      userToAdd.fname,
      userToAdd.lname,
      userToAdd.email,
      userToAdd.dob,
      userToAdd.instructorName
    );

    await expect(backendTestingPage.successMessage).toBeVisible();

    await page.waitForTimeout(3000);

    const result = await executeQuery(
      `SELECT * FROM students WHERE email = '${userToAdd.email}'`
    );
    expect(result.length).toBe(1);
  });

  test("Delete all students on UI and validate in DB", async ({ page }) => {
    await backendTestingPage.deleteAllButton.click();
    const result = await executeQuery(`SELECT * FROM students`);
    expect(result.length).toBe(2);
  });
});

// // ACCESSIBILITY TESTING: INSTALL THIRD PARTY AXE CORE FOR PLAYWRIGHT, AND RUN THE BELOW FUNCTION:
// test.only("Home page accessibilit check", async ({ page }) => {
//   await page.goto("https://www.techglobal-training.com/");

//   const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4

//   // convert into more minimal shape to render only what we need to see:
//   const results = accessibilityScanResults.violations.map((x) => {
//     return {
//       id: x.id,
//       impact: x.impact,
//       description: x.description,
//     };
//   });
//   console.log(results);
//   // expect(accessibilityScanResults.violations).toEqual([]); // 5
// });
