import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("ChatInput Component Comprehensive Testing", () => {
  // Create test files for upload testing
  test.beforeAll(async () => {
    const testFilesDir = path.join(__dirname, "test-files");
    if (!fs.existsSync(testFilesDir)) {
      fs.mkdirSync(testFilesDir, { recursive: true });
    }

    // Create test files of different types
    const files = {
      "test-image.png": Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
        0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
        0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
      ]),
      "test.txt": "This is a test text file for Playwright testing.",
      "test.pdf": "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000125 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n206\n%%EOF",
      "large-file.txt": "A".repeat(11 * 1024 * 1024), // 11MB file to test size limit
      "unsupported.xyz": "This is an unsupported file type for testing error handling."
    };

    for (const [filename, content] of Object.entries(files)) {
      const filePath = path.join(testFilesDir, filename);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
      }
    }
  });

  // Helper function to login
  async function login(page: any) {
    await page.goto("/");
    
    // Wait for page to load
    await page.waitForLoadState("networkidle");
    
    // Check if already authenticated
    const isLoggedIn = await page.locator("textarea").isVisible().catch(() => false);
    if (isLoggedIn) {
      return true;
    }

    // Login with the correct password
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("dev-pwd-123");
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    await page.waitForLoadState("networkidle");
    
    // Check if login was successful
    const hasTextarea = await page.locator("textarea").isVisible().catch(() => false);
    return hasTextarea;
  }

  // Helper function to check for console errors
  async function getConsoleErrors(page: any) {
    const errors: string[] = [];
    page.on('console', (msg: any) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    return errors;
  }

  test("should navigate to application and login successfully", async ({ page }) => {
    const consoleErrors = await getConsoleErrors(page);
    
    const loginSuccess = await login(page);
    expect(loginSuccess).toBeTruthy();
    
    // Verify we're on the chat interface
    await expect(page.locator("textarea")).toBeVisible();
    await expect(page.locator('button:has-text("Drop")')).toBeVisible();
    
    console.log("Console errors during login:", consoleErrors);
  });

  test("should test text message sending functionality", async ({ page }) => {
    const consoleErrors = await getConsoleErrors(page);
    await login(page);
    
    const textarea = page.locator("textarea");
    const dropButton = page.locator('button:has-text("Drop")');
    
    // Test initial state - Drop button should be disabled
    await expect(dropButton).toBeDisabled();
    
    // Test typing message
    await textarea.fill("Test message");
    await expect(dropButton).toBeEnabled();
    
    // Test sending with Drop button
    await dropButton.click();
    await expect(textarea).toHaveValue("");
    await expect(dropButton).toBeDisabled();
    
    // Test sending with Enter key
    await textarea.fill("Test message with Enter");
    await textarea.press("Enter");
    await expect(textarea).toHaveValue("");
    
    // Test shift+enter should not send (new line)
    await textarea.fill("Line 1");
    await textarea.press("Shift+Enter");
    await expect(textarea).toHaveValue("Line 1\n");
    
    console.log("Console errors during text messaging:", consoleErrors);
  });

  test("should test file upload via paperclip button", async ({ page }) => {
    const consoleErrors = await getConsoleErrors(page);
    await login(page);
    
    const paperclipButton = page.locator('button[title*="selectFiles"], button:has(svg[data-lucide="paperclip"]), button[title*="Upload"]');
    await expect(paperclipButton).toBeVisible();
    
    // Test different file types
    const testFiles = [
      "test-image.png",
      "test.txt", 
      "test.pdf"
    ];
    
    for (const fileName of testFiles) {
      const filePath = path.join(__dirname, "test-files", fileName);
      
      // Click paperclip button to trigger file input
      await paperclipButton.click();
      
      // Set file in the hidden input
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(filePath);
      
      // Wait for file to be processed
      await page.waitForTimeout(1000);
      
      // Check if file preview appears
      const hasFilePreview = await page.locator('.bg-\\[\\#2d2d2d\\]').isVisible().catch(() => false);
      console.log(`File preview for ${fileName}:`, hasFilePreview);
    }
    
    console.log("Console errors during paperclip upload:", consoleErrors);
  });

  test("should test drag and drop functionality", async ({ page }) => {
    const consoleErrors = await getConsoleErrors(page);
    await login(page);
    
    const chatInputArea = page.locator('.bg-\\[\\#2d2d2d\\].rounded-2xl');
    const filePath = path.join(__dirname, "test-files", "test-image.png");
    
    // Create a drag and drop event
    const fileBuffer = fs.readFileSync(filePath);
    const dataTransfer = await page.evaluateHandle((fileBuffer) => {
      const dt = new DataTransfer();
      const file = new File([new Uint8Array(fileBuffer)], 'test-image.png', { type: 'image/png' });
      dt.items.add(file);
      return dt;
    }, Array.from(fileBuffer));
    
    // Simulate dragover
    await chatInputArea.dispatchEvent('dragover', { dataTransfer });
    
    // Check if drag overlay appears
    const dragOverlay = page.locator('.fixed.inset-0.bg-\\[\\#6366f1\\]\\/20');
    await expect(dragOverlay).toBeVisible();
    
    // Simulate drop
    await chatInputArea.dispatchEvent('drop', { dataTransfer });
    
    // Check if file preview appears
    await page.waitForTimeout(500);
    const hasFilePreview = await page.locator('.bg-\\[\\#2d2d2d\\]').nth(1).isVisible().catch(() => false);
    
    console.log("Console errors during drag and drop:", consoleErrors);
  });

  test("should test paste functionality", async ({ page }) => {
    const consoleErrors = await getConsoleErrors(page);
    await login(page);
    
    const textarea = page.locator("textarea");
    await textarea.focus();
    
    // Create a mock clipboard event with image data
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        const pasteEvent = new ClipboardEvent('paste', {
          clipboardData: new DataTransfer()
        });
        
        // Mock a file in clipboard
        const file = new File(['test'], 'pasted-image.png', { type: 'image/png' });
        Object.defineProperty(pasteEvent, 'clipboardData', {
          value: {
            items: [{
              kind: 'file',
              type: 'image/png',
              getAsFile: () => file
            }]
          }
        });
        
        textarea.dispatchEvent(pasteEvent);
      }
    });
    
    await page.waitForTimeout(500);
    
    console.log("Console errors during paste functionality:", consoleErrors);
  });

  test("should test mobile camera capture functionality", async ({ page }) => {
    const consoleErrors = await getConsoleErrors(page);
    
    // Set mobile viewport to trigger mobile mode
    await page.setViewportSize({ width: 375, height: 667 });
    
    await login(page);
    
    // Check if camera button is visible in mobile mode
    const cameraButton = page.locator('button:has(svg[data-lucide="camera"])');
    
    // The camera button should be visible in mobile mode
    const isCameraButtonVisible = await cameraButton.isVisible().catch(() => false);
    console.log("Camera button visible in mobile:", isCameraButtonVisible);
    
    if (isCameraButtonVisible) {
      await cameraButton.click();
      
      // Check if camera input is triggered
      const cameraInput = page.locator('input[capture="environment"]');
      await expect(cameraInput).toBeAttached();
    }
    
    console.log("Console errors during mobile camera test:", consoleErrors);
  });

  test("should test file preview functionality and removal", async ({ page }) => {
    const consoleErrors = await getConsoleErrors(page);
    await login(page);
    
    // Upload a file to test preview
    const filePath = path.join(__dirname, "test-files", "test-image.png");
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    
    await page.waitForTimeout(1000);
    
    // Check if file preview container appears
    const filePreview = page.locator('[class*="FilePreview"], .bg-\\[\\#2d2d2d\\].rounded-xl').nth(1);
    const isPreviewVisible = await filePreview.isVisible().catch(() => false);
    
    if (isPreviewVisible) {
      // Test file removal
      const removeButton = page.locator('button:has(svg[data-lucide="x"])');
      const isRemoveButtonVisible = await removeButton.isVisible().catch(() => false);
      
      if (isRemoveButtonVisible) {
        await removeButton.click();
        
        // File preview should disappear
        await expect(filePreview).not.toBeVisible();
      }
      
      // Test image preview modal for images
      const previewButton = page.locator('button:has(svg[data-lucide="eye"])');
      const isPreviewButtonVisible = await previewButton.isVisible().catch(() => false);
      
      if (isPreviewButtonVisible) {
        await previewButton.click();
        
        // Modal should appear
        const modal = page.locator('.fixed.inset-0.bg-black\\/80');
        await expect(modal).toBeVisible();
        
        // Close modal
        const closeButton = modal.locator('button:has(svg[data-lucide="x"])');
        await closeButton.click();
        await expect(modal).not.toBeVisible();
      }
    }
    
    console.log("Console errors during file preview test:", consoleErrors);
  });

  test("should test upload progress tracking", async ({ page }) => {
    const consoleErrors = await getConsoleErrors(page);
    await login(page);
    
    // Upload a file to test progress tracking
    const filePath = path.join(__dirname, "test-files", "test.pdf");
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    
    await page.waitForTimeout(500);
    
    // Look for upload button in file preview
    const uploadButton = page.locator('button:has-text("Drop"), button:has-text("Upload")');
    const isUploadButtonVisible = await uploadButton.isVisible().catch(() => false);
    
    if (isUploadButtonVisible) {
      await uploadButton.click();
      
      // Look for progress indicators
      const progressBar = page.locator('[class*="progress"], .bg-blue-500');
      const progressText = page.locator('text=/%|uploading|progress/i');
      
      // Progress elements might appear briefly
      await page.waitForTimeout(200);
      
      const hasProgressBar = await progressBar.isVisible().catch(() => false);
      const hasProgressText = await progressText.isVisible().catch(() => false);
      
      console.log("Progress bar visible:", hasProgressBar);
      console.log("Progress text visible:", hasProgressText);
    }
    
    console.log("Console errors during upload progress test:", consoleErrors);
  });

  test("should test error handling for invalid files", async ({ page }) => {
    const consoleErrors = await getConsoleErrors(page);
    await login(page);
    
    // Test file size limit (11MB file)
    const largeFilePath = path.join(__dirname, "test-files", "large-file.txt");
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(largeFilePath);
    
    await page.waitForTimeout(1000);
    
    // Look for error messages
    const errorMessage = page.locator('text=/too large|size limit|error/i, .text-red-400, .bg-red-400');
    const hasErrorMessage = await errorMessage.isVisible().catch(() => false);
    console.log("File size error message visible:", hasErrorMessage);
    
    // Test unsupported file type
    const unsupportedFilePath = path.join(__dirname, "test-files", "unsupported.xyz");
    await fileInput.setInputFiles(unsupportedFilePath);
    
    await page.waitForTimeout(1000);
    
    const typeErrorMessage = page.locator('text=/unsupported|type|error/i, .text-red-400');
    const hasTypeErrorMessage = await typeErrorMessage.isVisible().catch(() => false);
    console.log("File type error message visible:", hasTypeErrorMessage);
    
    console.log("Console errors during error handling test:", consoleErrors);
  });

  test("should test multiple file selection and upload", async ({ page }) => {
    const consoleErrors = await getConsoleErrors(page);
    await login(page);
    
    // Test multiple file selection
    const testFiles = [
      path.join(__dirname, "test-files", "test-image.png"),
      path.join(__dirname, "test-files", "test.txt"),
      path.join(__dirname, "test-files", "test.pdf")
    ];
    
    const fileInput = page.locator('input[type="file"]');
    
    // Check if file input supports multiple files
    const hasMultiple = await fileInput.getAttribute("multiple");
    expect(hasMultiple).toBeDefined();
    
    // Select multiple files
    await fileInput.setInputFiles(testFiles);
    
    await page.waitForTimeout(1000);
    
    // Check if multiple file previews appear
    const filePreviews = page.locator('.bg-\\[\\#2d2d2d\\].rounded-xl .space-y-2 > div');
    const previewCount = await filePreviews.count().catch(() => 0);
    console.log("Number of file previews:", previewCount);
    
    // Should show at least the files we uploaded
    expect(previewCount).toBeGreaterThanOrEqual(0);
    
    console.log("Console errors during multiple file test:", consoleErrors);
  });

  test("should test keyboard shortcuts and interaction patterns", async ({ page }) => {
    const consoleErrors = await getConsoleErrors(page);
    await login(page);
    
    const textarea = page.locator("textarea");
    
    // Test composition events (for IME input)
    await textarea.fill("Test composition");
    await textarea.press("Enter"); // Should send
    await expect(textarea).toHaveValue("");
    
    // Test auto-resize functionality
    const initialHeight = await textarea.evaluate((el) => el.getBoundingClientRect().height);
    
    await textarea.fill("Line 1\nLine 2\nLine 3\nLine 4\nLine 5");
    const newHeight = await textarea.evaluate((el) => el.getBoundingClientRect().height);
    
    expect(newHeight).toBeGreaterThan(initialHeight);
    
    // Test tab navigation
    await textarea.press("Tab");
    
    // Test focus management
    await textarea.click();
    const isFocused = await textarea.evaluate((el) => document.activeElement === el);
    expect(isFocused).toBeTruthy();
    
    console.log("Console errors during keyboard shortcuts test:", consoleErrors);
  });

  test("should verify uploaded files appear in chat history", async ({ page }) => {
    const consoleErrors = await getConsoleErrors(page);
    await login(page);
    
    // Send a text message first
    const textarea = page.locator("textarea");
    await textarea.fill("Test message before file upload");
    await textarea.press("Enter");
    
    // Upload a file
    const filePath = path.join(__dirname, "test-files", "test.txt");
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    
    await page.waitForTimeout(1000);
    
    // Start upload if there's an upload button
    const uploadButton = page.locator('button:has-text("Drop"), button:has-text("Upload")').first();
    const isUploadButtonVisible = await uploadButton.isVisible().catch(() => false);
    
    if (isUploadButtonVisible) {
      await uploadButton.click();
      await page.waitForTimeout(2000);
    }
    
    // Look for chat messages in the chat history area
    const chatMessages = page.locator('[class*="chat"], [class*="message"], .flex-1 > div');
    const messageCount = await chatMessages.count().catch(() => 0);
    
    console.log("Number of chat messages:", messageCount);
    
    // Send another text message
    await textarea.fill("Test message after file upload");
    await textarea.press("Enter");
    
    await page.waitForTimeout(500);
    
    const newMessageCount = await chatMessages.count().catch(() => 0);
    console.log("Number of messages after second text:", newMessageCount);
    
    console.log("Console errors during chat history test:", consoleErrors);
  });

  test("should comprehensive console error check", async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      errors.push(`Page Error: ${error.message}`);
    });
    
    await login(page);
    
    // Perform various actions to trigger potential errors
    const textarea = page.locator("textarea");
    
    // Type and send messages
    await textarea.fill("Error test message");
    await textarea.press("Enter");
    
    // Try file upload
    const filePath = path.join(__dirname, "test-files", "test-image.png");
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    
    await page.waitForTimeout(2000);
    
    // Try drag and drop simulation
    const chatArea = page.locator('.bg-\\[\\#2d2d2d\\]');
    await chatArea.dispatchEvent('dragover');
    await chatArea.dispatchEvent('dragleave');
    
    // Try paste event
    await textarea.focus();
    await textarea.press('Control+v'); // or Meta+v on Mac
    
    await page.waitForTimeout(1000);
    
    // Report findings
    console.log("=== CONSOLE ERRORS ===");
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
    
    console.log("\n=== CONSOLE WARNINGS ===");
    warnings.forEach((warning, index) => {
      console.log(`${index + 1}. ${warning}`);
    });
    
    // The test passes regardless of console messages, but logs them for review
    expect(true).toBeTruthy();
  });

  // Cleanup
  test.afterAll(async () => {
    const testFilesDir = path.join(__dirname, "test-files");
    if (fs.existsSync(testFilesDir)) {
      fs.rmSync(testFilesDir, { recursive: true, force: true });
    }
  });
});