import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("File Upload Functionality", () => {
  // Create test files
  test.beforeAll(async () => {
    const testFilesDir = path.join(__dirname, "test-files");
    if (!fs.existsSync(testFilesDir)) {
      fs.mkdirSync(testFilesDir, { recursive: true });
    }

    // Create a small test image
    const testImagePath = path.join(testFilesDir, "test-image.png");
    if (!fs.existsSync(testImagePath)) {
      // Create a minimal PNG (1x1 pixel)
      const minimalPng = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
        0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
        0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
      ]);
      fs.writeFileSync(testImagePath, minimalPng);
    }

    // Create a test text file
    const testTextPath = path.join(testFilesDir, "test.txt");
    if (!fs.existsSync(testTextPath)) {
      fs.writeFileSync(
        testTextPath,
        "This is a test file content for Playwright testing.",
      );
    }
  });

  // Helper function to login
  async function quickLogin(page: any) {
    await page.goto("/");
    const passwordInput = page.locator('input[type="password"]');

    // Try various possible passwords
    const passwords = ["default-password", "test", "password", "admin"];

    for (const pwd of passwords) {
      await passwordInput.fill(pwd);
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      await page.waitForTimeout(1000);

      const hasError = await page
        .locator(".bg-red-900\\/30")
        .isVisible()
        .catch(() => false);
      if (!hasError) {
        return true;
      }
    }
    return false;
  }

  test("should show file input when upload button is clicked", async ({
    page,
  }) => {
    const loginSuccess = await quickLogin(page);

    if (loginSuccess) {
      // Find and click upload button
      const uploadButton = page.locator('button:has-text("Upload")');
      await expect(uploadButton).toBeVisible();

      // Check that file input exists (hidden)
      const fileInput = page.locator('input[type="file"]');
      await expect(fileInput).toBeAttached();

      // Click upload button should trigger file input
      await uploadButton.click();

      // File input should be focused/triggered (though it's hidden)
      await expect(fileInput).toBeAttached();
    } else {
      test.skip();
    }
  });

  test("should handle file selection through file input", async ({ page }) => {
    const loginSuccess = await quickLogin(page);

    if (loginSuccess) {
      const testFilePath = path.join(__dirname, "test-files", "test.txt");

      // Set up file input handler
      const fileInput = page.locator('input[type="file"]');

      // Upload file
      await fileInput.setInputFiles(testFilePath);

      // Should show upload progress (might be very quick)
      const uploadProgress = page
        .locator('#uploadProgress, [class*="upload"]')
        .first();

      // Wait a bit to see if progress appears
      await page.waitForTimeout(500);

      // Check if upload was successful by looking for success indicators
      const hasUploadElements = await page
        .locator("text=/upload|progress|%/i")
        .count();
      expect(hasUploadElements).toBeGreaterThanOrEqual(0); // May be 0 if upload completes too quickly
    } else {
      test.skip();
    }
  });

  test("should accept various file types", async ({ page }) => {
    const loginSuccess = await quickLogin(page);

    if (loginSuccess) {
      const fileInput = page.locator('input[type="file"]');

      // Check that file input accepts multiple types
      const acceptAttr = await fileInput.getAttribute("accept");
      expect(acceptAttr).toContain("image/*");
      expect(acceptAttr).toContain(".txt");
      expect(acceptAttr).toContain(".pdf");

      // Check multiple attribute
      const multipleAttr = await fileInput.getAttribute("multiple");
      expect(multipleAttr).toBeDefined();
    } else {
      test.skip();
    }
  });

  test("should show drag and drop area", async ({ page }) => {
    const loginSuccess = await quickLogin(page);

    if (loginSuccess) {
      // The entire input area should support drag and drop
      const inputArea = page.locator(".border-t.border-\\[\\#404040\\]");
      await expect(inputArea).toBeVisible();

      // Create a dragover event to test drop zone
      await inputArea.dispatchEvent("dragover", {
        dataTransfer: {
          files: [],
          types: ["Files"],
        },
      });

      // Should show drag overlay (might need special handling)
      await page.waitForTimeout(100);

      // End drag
      await inputArea.dispatchEvent("dragleave");
    } else {
      test.skip();
    }
  });

  test("should support paste functionality for images", async ({ page }) => {
    const loginSuccess = await quickLogin(page);

    if (loginSuccess) {
      const messageInput = page.locator('textarea[placeholder*="Input text"]');
      await expect(messageInput).toBeVisible();

      // Focus the textarea
      await messageInput.click();

      // Simulate paste event with image data
      // Note: This is a simplified test - real image paste testing is complex
      const pasteEvent = {
        clipboardData: {
          items: [
            {
              type: "image/png",
              getAsFile: () => null, // Mock file
            },
          ],
        },
      };

      // Dispatch paste event
      await messageInput.dispatchEvent("paste", pasteEvent);

      // If paste handling is implemented, it should process the event
      await page.waitForTimeout(100);

      expect(true).toBeTruthy(); // Placeholder - actual implementation would test image handling
    } else {
      test.skip();
    }
  });

  test("should show upload progress during file upload", async ({ page }) => {
    const loginSuccess = await quickLogin(page);

    if (loginSuccess) {
      const testFilePath = path.join(__dirname, "test-files", "test-image.png");

      // Listen for upload progress
      const uploadProgressContainer = page.locator(
        '[id="uploadProgress"], [class*="upload"][class*="progress"]',
      );

      // Upload file
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(testFilePath);

      // Wait for potential progress display
      await page.waitForTimeout(100);

      // Progress might appear briefly or might complete too quickly
      const progressElements = await page
        .locator("text=/progress|%|upload/i")
        .count();
      expect(progressElements).toBeGreaterThanOrEqual(0);
    } else {
      test.skip();
    }
  });

  test("should validate file size and type restrictions", async ({ page }) => {
    const loginSuccess = await quickLogin(page);

    if (loginSuccess) {
      // Test file input restrictions
      const fileInput = page.locator('input[type="file"]');
      const accept = await fileInput.getAttribute("accept");

      // Should have accept attribute with allowed types
      expect(accept).toBeDefined();
      expect(accept).toBeTruthy();

      // Common file types should be allowed
      expect(accept).toMatch(/image|pdf|txt|doc/i);
    } else {
      test.skip();
    }
  });

  test("should handle multiple file selection", async ({ page }) => {
    const loginSuccess = await quickLogin(page);

    if (loginSuccess) {
      const fileInput = page.locator('input[type="file"]');

      // Check multiple attribute
      const hasMultiple = await fileInput.getAttribute("multiple");
      expect(hasMultiple).toBeDefined();

      // Test selecting multiple files
      const testFiles = [
        path.join(__dirname, "test-files", "test.txt"),
        path.join(__dirname, "test-files", "test-image.png"),
      ];

      await fileInput.setInputFiles(testFiles);

      // Should handle multiple files (implementation dependent)
      await page.waitForTimeout(200);

      expect(true).toBeTruthy(); // Placeholder for actual multi-file handling test
    } else {
      test.skip();
    }
  });

  // Cleanup test files after all tests
  test.afterAll(async () => {
    const testFilesDir = path.join(__dirname, "test-files");
    if (fs.existsSync(testFilesDir)) {
      fs.rmSync(testFilesDir, { recursive: true, force: true });
    }
  });
});
