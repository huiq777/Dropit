import { test, expect } from '@playwright/test';

test.describe('Dropit File Upload System - Detailed Bug Hunt', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3002');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('1. Initial Navigation and Login', async ({ page }) => {
    // Take screenshot of initial page
    await page.screenshot({ 
      path: 'test-results/01-initial-page.png', 
      fullPage: true 
    });

    // Check if login form is present
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();

    // Fill password and submit
    await passwordInput.fill('dev-pwd-123');
    await page.locator('button[type="submit"]').click();

    // Wait for authentication to complete
    await page.waitForLoadState('networkidle');
    
    // Take screenshot after login
    await page.screenshot({ 
      path: 'test-results/02-after-login.png', 
      fullPage: true 
    });

    // Verify main interface elements are present
    await expect(page.locator('textarea')).toBeVisible(); // Chat input
  });

  test('2. Test Paperclip Upload Button', async ({ page }) => {
    // Login first
    await page.locator('input[type="password"]').fill('dev-pwd-123');
    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState('networkidle');

    // Look for paperclip/attachment button
    const attachmentButton = page.locator('[aria-label*="upload"], [aria-label*="attach"], button:has(svg[data-lucide="paperclip"]), button:has(svg[data-lucide="plus"])');
    
    await page.screenshot({ 
      path: 'test-results/03-before-paperclip-test.png', 
      fullPage: true 
    });

    if (await attachmentButton.count() > 0) {
      await attachmentButton.first().click();
      
      // Check if file input dialog opens (we can't directly test file picker, but check for errors)
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: 'test-results/04-after-paperclip-click.png', 
        fullPage: true 
      });
    } else {
      console.log('❌ No paperclip/attachment button found');
    }
  });

  test('3. Test File Manager Modal', async ({ page }) => {
    // Login first
    await page.locator('input[type="password"]').fill('dev-pwd-123');
    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState('networkidle');

    // Look for file manager button (folder icon)
    const folderButton = page.locator('button:has(svg[data-lucide="folder"]), button:has(svg[data-lucide="files"])');
    
    await page.screenshot({ 
      path: 'test-results/05-before-folder-test.png', 
      fullPage: true 
    });

    if (await folderButton.count() > 0) {
      await folderButton.first().click();
      
      // Wait for modal to appear
      await page.waitForTimeout(2000);
      
      // Check for modal/dialog
      const modal = page.locator('[role="dialog"], .modal, [data-testid*="modal"]');
      
      await page.screenshot({ 
        path: 'test-results/06-after-folder-click.png', 
        fullPage: true 
      });
      
      if (await modal.count() === 0) {
        console.log('❌ File manager modal did not open');
      }
    } else {
      console.log('❌ No folder/file manager button found');
    }
  });

  test('4. JavaScript Console Error Monitoring', async ({ page }) => {
    const consoleErrors: string[] = [];
    const networkErrors: string[] = [];

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for network failures
    page.on('response', response => {
      if (response.status() >= 400) {
        networkErrors.push(`${response.status()} - ${response.url()}`);
      }
    });

    // Login
    await page.locator('input[type="password"]').fill('dev-pwd-123');
    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState('networkidle');

    // Try to trigger upload-related actions
    const uploadButtons = page.locator('button:has(svg[data-lucide="paperclip"]), button:has(svg[data-lucide="plus"]), button:has(svg[data-lucide="folder"])');
    
    for (let i = 0; i < await uploadButtons.count(); i++) {
      try {
        await uploadButtons.nth(i).click();
        await page.waitForTimeout(1000);
      } catch (error) {
        console.log(`Error clicking button ${i}: ${error}`);
      }
    }

    await page.screenshot({ 
      path: 'test-results/07-console-error-test.png', 
      fullPage: true 
    });

    // Log all errors found
    console.log('🔍 Console Errors Found:', consoleErrors);
    console.log('🔍 Network Errors Found:', networkErrors);
    
    // Create error report
    const errorReport = {
      consoleErrors,
      networkErrors,
      timestamp: new Date().toISOString()
    };
    
    console.log('📋 Error Report:', JSON.stringify(errorReport, null, 2));
  });

  test('5. Drag and Drop Overlay Test', async ({ page }) => {
    // Login first
    await page.locator('input[type="password"]').fill('dev-pwd-123');
    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState('networkidle');

    await page.screenshot({ 
      path: 'test-results/08-before-drag-test.png', 
      fullPage: true 
    });

    // Simulate drag enter event to trigger drag overlay
    await page.evaluate(() => {
      const dragEvent = new DragEvent('dragenter', {
        bubbles: true,
        cancelable: true,
      });
      document.body.dispatchEvent(dragEvent);
    });

    await page.waitForTimeout(1000);

    await page.screenshot({ 
      path: 'test-results/09-after-drag-enter.png', 
      fullPage: true 
    });

    // Check for drag overlay
    const dragOverlay = page.locator('[class*="drag"], [class*="drop"], [data-testid*="drag"]');
    
    if (await dragOverlay.count() === 0) {
      console.log('❌ Drag overlay did not appear');
    } else {
      console.log('✅ Drag overlay appeared');
    }
  });

  test('6. API Upload Test', async ({ page }) => {
    const apiCalls: any[] = [];
    
    // Intercept API calls
    page.on('response', response => {
      if (response.url().includes('/api/upload')) {
        apiCalls.push({
          url: response.url(),
          status: response.status(),
          method: response.request().method()
        });
      }
    });

    // Login
    await page.locator('input[type="password"]').fill('dev-pwd-123');
    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState('networkidle');

    // Create a small test file and attempt upload
    const fileInput = page.locator('input[type="file"]');
    
    if (await fileInput.count() > 0) {
      // Create a test file
      const buffer = Buffer.from('test file content');
      await fileInput.setInputFiles({
        name: 'test.txt',
        mimeType: 'text/plain',
        buffer: buffer
      });

      await page.waitForTimeout(3000);
      
      console.log('🔍 API Upload Calls:', apiCalls);
    } else {
      console.log('❌ No file input found for testing');
    }

    await page.screenshot({ 
      path: 'test-results/10-api-upload-test.png', 
      fullPage: true 
    });
  });

  test('7. Mobile Responsiveness Test', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    
    // Login
    await page.locator('input[type="password"]').fill('dev-pwd-123');
    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState('networkidle');

    await page.screenshot({ 
      path: 'test-results/11-mobile-view.png', 
      fullPage: true 
    });

    // Check if key elements are still accessible
    const textarea = page.locator('textarea');
    const uploadButtons = page.locator('button:has(svg)');
    
    await expect(textarea).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.screenshot({ 
      path: 'test-results/12-tablet-view.png', 
      fullPage: true 
    });

    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('8. Component Interaction Test', async ({ page }) => {
    // Login
    await page.locator('input[type="password"]').fill('dev-pwd-123');
    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState('networkidle');

    // Test textarea interaction
    const textarea = page.locator('textarea');
    await textarea.fill('Test message content');
    
    await page.screenshot({ 
      path: 'test-results/13-textarea-filled.png', 
      fullPage: true 
    });

    // Test send button
    const sendButton = page.locator('button[type="submit"], button:has(svg[data-lucide="send"])');
    
    if (await sendButton.count() > 0) {
      await sendButton.click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ 
        path: 'test-results/14-after-send.png', 
        fullPage: true 
      });
    }

    // Test language toggle if present
    const langToggle = page.locator('[data-testid*="lang"], button:has-text("中文"), button:has-text("EN")');
    
    if (await langToggle.count() > 0) {
      await langToggle.first().click();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: 'test-results/15-language-toggle.png', 
        fullPage: true 
      });
    }
  });
});