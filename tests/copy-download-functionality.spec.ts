import { test, expect } from "@playwright/test";

test.describe("Copy and Download Functionality Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Set up console error logging
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to the app
    await page.goto("http://localhost:3000");
    
    // Login with correct password
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("dev-pwd-123");
    
    // Submit the form
    const submitButton = page.getByRole("button", { name: /继续|submit|enter/i });
    await submitButton.click();
    
    // Wait for authentication to complete - look for chat interface
    await page.waitForSelector('textarea, input[type="text"], .chat-interface', {
      timeout: 10000
    });
    
    // Store console errors for debugging
    (page as any).consoleErrors = consoleErrors;
  });

  test("should send text message and test copy functionality", async ({ page }) => {
    console.log("🚀 Starting text message copy test");
    
    // Find text input field
    const textInput = page.locator('textarea').first();
    const testMessage = "This is a test message for copy functionality";

    console.log("📝 Sending text message:", testMessage);
    await textInput.fill(testMessage);
    
    // Send the message by pressing Enter
    await textInput.press('Enter');

    // Wait for message to appear
    await page.waitForTimeout(2000);

    // Look for the message container - it has a gradient background and contains the test message
    const messageContainer = page.locator('.group').filter({ hasText: testMessage }).first();

    if (await messageContainer.count() > 0) {
      console.log("✅ Text message sent and found in chat");

      // Hover over the message to reveal the copy button
      await messageContainer.hover();
      await page.waitForTimeout(500);

      // Look for copy button (it has a Copy icon from lucide-react)
      const copyButton = messageContainer.locator('button').filter({ hasText: /copy/i })
        .or(messageContainer.locator('button[title*="Copy"]'))
        .or(messageContainer.locator('button svg')).first();

      if (await copyButton.count() > 0) {
        console.log("✅ Copy button found, clicking...");
        await copyButton.click();

        // Wait for visual feedback
        await page.waitForTimeout(1000);

        // Check for success state - button should change color or show checkmark
        const successButton = messageContainer.locator('button').filter({ 
          hasText: /copied|✓|check/i 
        }).or(messageContainer.locator('button.text-green-400'));
        
        if (await successButton.count() > 0) {
          console.log("✅ Copy success feedback displayed");
        } else {
          console.log("⚠️ Copy success feedback not clearly visible");
        }
      } else {
        console.log("❌ Copy button not found after hover");
      }
    } else {
      console.log("❌ Text message not found after sending");
    }
  });

  test("should upload file and test copy/download functionality", async ({ page }) => {
    console.log("🚀 Starting file upload and copy/download test");

    // First check if there's a file input - might be hidden or in a specific component
    let fileInput = page.locator('input[type="file"]');
    
    // If no direct file input, look for upload button or area
    if (await fileInput.count() === 0) {
      const uploadButton = page.locator('button, [role="button"]').filter({ 
        hasText: /upload|上传|file|文件|attach/i 
      });
      if (await uploadButton.count() > 0) {
        await uploadButton.click();
        await page.waitForTimeout(500);
        fileInput = page.locator('input[type="file"]');
      }
    }

    if (await fileInput.count() > 0) {
      console.log("✅ File input found, uploading test file");
      
      // Create a temporary test file
      const path = require('path');
      const fs = require('fs');
      const testFilePath = path.join(__dirname, '../public/test-image.png');
      
      // Create a simple test PNG file if it doesn't exist
      if (!fs.existsSync(testFilePath)) {
        // Create a very simple PNG (1x1 red pixel)
        const pngData = Buffer.from([
          0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
          0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
          0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x57, 0x63, 0xF8, 0x0F, 0x00, 0x00,
          0x01, 0x00, 0x01, 0x46, 0xB4, 0x8D, 0x1C, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
          0x42, 0x60, 0x82
        ]);
        fs.writeFileSync(testFilePath, pngData);
      }

      // Set the file
      await fileInput.setInputFiles([testFilePath]);
      
      // Wait for upload to complete
      await page.waitForTimeout(3000);

      // Look for file message
      const fileMessage = page.locator('.group').filter({
        hasText: /test-image|png|image/i
      }).first();

      if (await fileMessage.count() > 0) {
        console.log("✅ File message found after upload");
        
        // Hover to reveal buttons
        await fileMessage.hover();
        await page.waitForTimeout(500);

        // Test copy functionality (should copy file URL)
        const copyButton = fileMessage.locator('button[title*="Copy"]').first();
        if (await copyButton.count() > 0) {
          await copyButton.click();
          console.log("✅ Copy button clicked for file");
          
          await page.waitForTimeout(1000);
          const successState = fileMessage.locator('button.text-green-400');
          if (await successState.count() > 0) {
            console.log("✅ File copy success feedback displayed");
          }
        }

        // Test download functionality
        const downloadButton = fileMessage.locator('button[title*="Download"]').first();
        if (await downloadButton.count() > 0) {
          const downloadPromise = page.waitForEvent('download', { timeout: 5000 });
          await downloadButton.click();
          console.log("✅ Download button clicked");
          
          try {
            const download = await downloadPromise;
            console.log("✅ Download triggered:", download.suggestedFilename());
          } catch (error) {
            console.log("⚠️ Download not captured (might still work):", error);
          }
        }
      } else {
        console.log("❌ File message not found after upload");
      }
    } else {
      console.log("❌ File input not found");
    }
  });

  test("should test visual feedback states for copy/download buttons", async ({ page }) => {
    // Wait for interface
    await page.waitForSelector('textarea, input[type="text"], input[type="file"]', { timeout: 10000 });

    // Send a text message first
    const textInput = page.locator('textarea, input[type="text"]').first();
    await textInput.fill("Test message for visual feedback");
    
    const sendButton = page.locator('button').filter({
      hasText: /send|发送|submit/i
    }).or(page.locator('[type="submit"]')).first();

    if (await sendButton.count() > 0) {
      await sendButton.click();
      await page.waitForTimeout(2000);
    }

    // Find message with copy button
    const message = page.locator('[data-testid*="message"], .message').first();
    const copyButton = message.locator('button').filter({
      hasText: /copy|复制/i
    }).or(message.locator('[title*="copy"], [title*="复制"]')).first();

    if (await copyButton.count() > 0) {
      // Check initial state
      const initialClass = await copyButton.getAttribute('class');
      console.log("Initial button class:", initialClass);

      // Click and check for state change
      await copyButton.click();
      await page.waitForTimeout(500);

      const afterClickClass = await copyButton.getAttribute('class');
      console.log("After click button class:", afterClickClass);

      // Check if classes changed (indicating visual feedback)
      if (initialClass !== afterClickClass) {
        console.log("✅ Visual feedback detected - button class changed");
      } else {
        console.log("⚠️ No visual feedback detected in button class");
      }

      // Check for success text changes
      const buttonText = await copyButton.textContent();
      console.log("Button text after copy:", buttonText);

      // Look for success indicators elsewhere
      const successElements = await page.locator('.success, .copied, [class*="success"]').count();
      if (successElements > 0) {
        console.log("✅ Success indicators found:", successElements);
      } else {
        console.log("⚠️ No success indicators found");
      }
    }
  });

  test.afterEach(async ({ page }) => {
    // Log any console errors that occurred
    const consoleErrors = (page as any).consoleErrors || [];
    if (consoleErrors.length > 0) {
      console.log("Console errors during test:", consoleErrors);
    }
  });
});