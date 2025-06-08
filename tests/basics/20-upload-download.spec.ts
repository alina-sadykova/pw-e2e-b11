import { expect, test } from "@playwright/test";

import fs from "fs"; // Node JS dependency file system
import path from "path"; // Node JS dependency

test.describe("File Upload and Download", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "https://www.techglobal-training.com/frontend/file-download"
    );
  });
  test("File download", async ({ page }) => {
    const [downloadPromise] = await Promise.all([
      page.waitForEvent("download"),
      page.locator("#file_download").click(),
    ]);

    const path = "downloads/" + downloadPromise.suggestedFilename(); // creating path

    await downloadPromise.saveAs(path); // saving the downloaded file

    const isDownloaded = fs.existsSync(path); // check if path exist

    expect(isDownloaded).toBeTruthy();
  });

  test("File upload", async ({ page }) => {
    await page.locator("#file_upload").setInputFiles("test-files/sample.txt");

    // to upload two files:
    // await page
    //   .locator("#file_upload")
    //   .setInputFiles(["test-files/sample.txt", "test-files/sample.png"]);

    await page.locator("#file_submit").click();

    await expect(page.locator("#result")).toContainText("sample.txt");
  });
});
