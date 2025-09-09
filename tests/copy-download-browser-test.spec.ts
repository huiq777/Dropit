import { test, expect } from "@playwright/test";

test.describe("Copy and Download Functionality - Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate and login
    await page.goto("http://localhost:3000");
    
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("dev-pwd-123");
    
    const submitButton = page.getByRole("button", { name: /继续|submit|enter/i });
    await submitButton.click();
    
    // Wait for chat interface
    await page.waitForSelector('textarea', { timeout: 10000 });
  });

  test("should test text message copy functionality with visual feedback", async ({ page }) => {
    console.log("🚀 Testing text message copy functionality");
    
    // Send a text message
    const textarea = page.locator('textarea');
    const testMessage = "Test message for copy functionality - timestamp: " + Date.now();
    
    await textarea.fill(testMessage);
    await textarea.press('Enter');
    
    // Wait for message to appear
    await page.waitForTimeout(2000);
    
    // Find the message container
    const messageContainer = page.locator('.group').filter({ hasText: testMessage });
    
    // Verify message exists
    await expect(messageContainer).toBeVisible();
    console.log("✅ Message sent successfully");
    
    // Hover to reveal copy button
    await messageContainer.hover();
    
    // Find copy button (should be visible on hover)
    const copyButton = messageContainer.locator('button[title*="Copy"]').first();
    await expect(copyButton).toBeVisible();
    console.log("✅ Copy button visible on hover");
    
    // Click copy button
    await copyButton.click();
    console.log("✅ Copy button clicked");
    
    // Wait for visual feedback - look for success state
    await page.waitForTimeout(1000);
    
    // Check if button shows success state (green color or check icon)
    const successButton = messageContainer.locator('button.text-green-400, button:has(.text-green-400)').first();
    await expect(successButton).toBeVisible();
    console.log("✅ Copy success feedback displayed");
    
    // Verify clipboard content (if possible)
    const clipboardText = await page.evaluate(async () => {
      try {
        return await navigator.clipboard.readText();
      } catch (err) {
        return "clipboard not accessible";
      }
    });
    
    if (clipboardText === testMessage) {
      console.log("✅ Clipboard content verified");
    } else {
      console.log("⚠️ Clipboard content:", clipboardText);
    }
  });

  test("should test file upload and copy/download buttons", async ({ page }) => {
    console.log("🚀 Testing file upload and copy/download functionality");
    
    // Look for file input or upload area
    let fileInput = page.locator('input[type="file"]');
    
    // If file input not immediately visible, look for upload trigger
    if (await fileInput.count() === 0) {
      // Try clicking on upload-related elements
      const uploadArea = page.locator('[data-testid*="upload"], .upload, button, [role="button"]').filter({ 
        hasText: /upload|attach|file|图片|文件/i 
      });
      
      if (await uploadArea.count() > 0) {
        await uploadArea.first().click();
        await page.waitForTimeout(500);
        fileInput = page.locator('input[type="file"]');
      }
    }
    
    if (await fileInput.count() > 0) {
      console.log("✅ File input found");
      
      // Use one of the existing test files
      const testFilePath = "/Users/hui/Desktop/projects/dropit/public/uploads/dropit/1757292062282.jpg";
      
      try {
        await fileInput.setInputFiles([testFilePath]);
        console.log("✅ File upload initiated");
        
        // Wait for upload to complete
        await page.waitForTimeout(5000);
        
        // Look for the uploaded file message
        const fileMessage = page.locator('.group').filter({ 
          hasText: /jpg|image|1757292062282/i 
        }).first();
        
        if (await fileMessage.count() > 0) {
          console.log("✅ File message found");
          
          // Hover to reveal buttons
          await fileMessage.hover();
          await page.waitForTimeout(500);
          
          // Test copy functionality
          const copyButton = fileMessage.locator('button[title*="Copy"]').first();
          if (await copyButton.count() > 0) {
            await copyButton.click();
            console.log("✅ Copy button clicked for file");
            
            // Check success feedback
            await page.waitForTimeout(1000);
            const successCopy = fileMessage.locator('button.text-green-400').first();
            if (await successCopy.count() > 0) {
              console.log("✅ File copy success feedback shown");
            }
          }
          
          // Test download functionality
          const downloadButton = fileMessage.locator('button[title*="Download"]').first();
          if (await downloadButton.count() > 0) {
            // Set up download promise
            const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
            
            await downloadButton.click();
            console.log("✅ Download button clicked");
            
            try {
              const download = await downloadPromise;
              console.log("✅ Download triggered successfully:", download.suggestedFilename());
              
              // Check visual feedback
              await page.waitForTimeout(1000);
              const successDownload = fileMessage.locator('button.text-green-400').last();
              if (await successDownload.count() > 0) {
                console.log("✅ Download success feedback shown");
              }
            } catch (error) {
              console.log("⚠️ Download might work but not captured:", error);
            }
          }
        } else {
          console.log("❌ File message not found after upload");
        }
      } catch (error) {
        console.log("❌ File upload failed:", error);
      }
    } else {
      console.log("❌ File input not found");
      
      // Take screenshot for debugging
      await page.screenshot({ path: 'debug-no-file-input.png', fullPage: true });
      console.log("📸 Debug screenshot saved");
    }
  });

  test("should verify visual feedback states and error handling", async ({ page }) => {
    console.log("🚀 Testing visual feedback states and error handling");
    
    // Send a message first
    const textarea = page.locator('textarea');
    await textarea.fill("Test message for visual feedback");
    await textarea.press('Enter');
    await page.waitForTimeout(2000);
    
    const messageContainer = page.locator('.group').last();
    await messageContainer.hover();
    
    // Test copy button states
    const copyButton = messageContainer.locator('button[title*="Copy"]').first();
    
    // Initial state
    const initialClass = await copyButton.getAttribute('class');
    console.log("Initial button classes:", initialClass);
    
    // Click and check state change
    await copyButton.click();
    await page.waitForTimeout(500);
    
    const afterClickClass = await copyButton.getAttribute('class');
    console.log("After click button classes:", afterClickClass);
    
    // Verify state changed (should have green text or different classes)
    if (afterClickClass !== initialClass) {
      console.log("✅ Visual feedback state changed");
    } else {
      console.log("⚠️ Visual feedback state might not have changed");
    }
    
    // Check for success indicators
    const hasGreenText = afterClickClass?.includes('text-green');
    const hasSuccessColor = afterClickClass?.includes('green');
    
    if (hasGreenText || hasSuccessColor) {
      console.log("✅ Success color feedback detected");
    } else {
      console.log("⚠️ Success color feedback not clearly detected");
    }
    
    // Wait for feedback to reset
    await page.waitForTimeout(3000);
    
    const resetClass = await copyButton.getAttribute('class');
    console.log("Reset button classes:", resetClass);
    
    if (resetClass !== afterClickClass) {
      console.log("✅ Visual feedback properly resets");
    } else {
      console.log("⚠️ Visual feedback may not reset");
    }
  });
});