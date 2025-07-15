import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
/* path is used for CI/CDprocesses */
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // snapshotDir: "./test-results/snapshots",
  // globalSetup: "./tests/global-setup/globalSetup",
  // globalTeardown: "./tests/global-setup/globalTeardown", // Path to the global teardown file. This file will be required and run after all the tests. It must export a single function. See also testConfig.globalSetup. Pass an array of paths to specify multiple global teardown files.
  testDir: "./tests",
  timeout: 10 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined, // undefined let numbers of workers based on capacity of the laptop
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: "html",
  reporter: [
    ["list"],
    ["json", { outputFile: "playwright-report/test-results.json" }],
    ["html", { open: "never" }],
    ["junit", { outputFile: "playwright-report/reports.xml" }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    //storageState: '',
    headless: true,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: process.env.baseURL, // "https://www.techglobal-training.com"

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    // one default configuration:
    {
      name: "Regression",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    // configuration for individual projects:
    {
      name: "Basics",
      testDir: "./tests/basics",
      fullyParallel: true,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        baseURL: "https://www.techglobal-training.com/",
        headless: false,
        actionTimeout: 20000,
      },
    },
    {
      name: "Demo Blaze Chrome",
      testDir: "./tests/demo-blaze",
      dependencies: ["Demo Blaze Set up"], // pass storage state as dependency
      fullyParallel: false,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        baseURL: "https://demoblaze.com/index.html#",
        headless: false,
        storageState: "./tests/auth/demo-blaze.json",
      },
    },
    {
      name: "Demo Blaze Safari",
      testDir: "./tests/demo-blaze",
      dependencies: ["Demo Blaze Set up"],
      use: {
        ...devices["Desktop Safari"],
        baseURL: "https://demoblaze.com/index.html#",
        headless: false,
        storageState: "./tests/auth/demo-blaze.json",
      },
    },
    {
      name: "Demo Blaze Set up",
      testDir: "./tests/demo-blaze-setup",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://demoblaze.com/index.html#",
        headless: false,
      },
    },
    {
      name: "DB Automation",
      testDir: "./tests/db-automation",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    // {
    //   name: "API Automation",
    //   testDir: "./tests/api",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //   },
    // },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
