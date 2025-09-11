import { test, expect } from '@playwright/test';

test.describe('Text Wrapping Fix Verification', () => {
  test('verify text wrapping functionality in Dropit application', async ({ page }) => {
    // Navigate directly to the running application
    await page.goto('http://localhost:3002');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ path: 'screenshots/01-initial-load.png', fullPage: true });
    
    // Check if authentication is required
    try {
      const authForm = await page.waitForSelector('form, input[type="password"]', { timeout: 5000 });
      if (authForm) {
        console.log('Authentication form detected');
        
        // Try common password inputs
        const passwordInputs = await page.locator('input[type="password"]');
        const count = await passwordInputs.count();
        
        if (count > 0) {
          // Try empty password first (common in development)
          await passwordInputs.first().fill('');
          await page.keyboard.press('Enter');
          
          // Wait and see if we're authenticated
          await page.waitForTimeout(2000);
          
          // If still on auth page, try a common test password
          if (await page.locator('input[type="password"]').isVisible()) {
            await passwordInputs.first().fill('test123');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(2000);
          }
        }
        
        // Take screenshot after auth attempt
        await page.screenshot({ path: 'screenshots/02-after-auth.png', fullPage: true });
      }
    } catch (e) {
      console.log('No authentication required or already authenticated');
    }
    
    // Look for the main chat interface
    try {
      // Wait for any text input field (textarea, input, or contenteditable)
      const inputElement = await page.waitForSelector(
        'textarea, input[type="text"], [contenteditable="true"], input:not([type="password"]):not([type="submit"]):not([type="button"])', 
        { timeout: 10000 }
      );
      
      console.log('Found input element');
      
      // Test 1: Long text message
      const longText = 'asdsaddasddasdadsadsadasdadsadsadadsdasdadassadsaddsadsadasadsdasdasdasdasadasdasdasdads';
      
      await inputElement.fill(longText);
      await page.screenshot({ path: 'screenshots/03-long-text-typed.png', fullPage: true });
      
      // Submit the message - try different ways
      try {
        // Try clicking a send button first
        const sendButton = page.locator('button').filter({ hasText: /send|submit/i }).first();
        if (await sendButton.isVisible({ timeout: 2000 })) {
          await sendButton.click();
        } else {
          // Fallback to Enter key
          await page.keyboard.press('Enter');
        }
      } catch {
        await page.keyboard.press('Enter');
      }
      
      // Wait for message to appear and take screenshot
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'screenshots/04-long-text-sent.png', fullPage: true });
      
      // Test 2: Normal text message
      const normalText = 'This is a normal message that should display correctly.';
      await inputElement.fill(normalText);
      
      try {
        const sendButton = page.locator('button').filter({ hasText: /send|submit/i }).first();
        if (await sendButton.isVisible({ timeout: 2000 })) {
          await sendButton.click();
        } else {
          await page.keyboard.press('Enter');
        }
      } catch {
        await page.keyboard.press('Enter');
      }
      
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'screenshots/05-normal-text-sent.png', fullPage: true });
      
      // Test 3: Multiple long messages
      const longMessages = [
        'verylongwordwithoutspacesthatshouldalsobehandledproperly',
        'anotherlongmessagewithverylongwordsthatshoulwrapproperly',
        'thisisaverylongmessagethatcontainsmultiplewordsthatarealsoverylongandshouldalllwrapproperlywithinthecontainerboundarieswithoutcausinganyoverflowissues'
      ];
      
      for (let i = 0; i < longMessages.length; i++) {
        await inputElement.fill(longMessages[i]);
        
        try {
          const sendButton = page.locator('button').filter({ hasText: /send|submit/i }).first();
          if (await sendButton.isVisible({ timeout: 2000 })) {
            await sendButton.click();
          } else {
            await page.keyboard.press('Enter');
          }
        } catch {
          await page.keyboard.press('Enter');
        }
        
        await page.waitForTimeout(2000);
      }
      
      await page.screenshot({ path: 'screenshots/06-multiple-messages-final.png', fullPage: true });
      
      // Check for horizontal scroll (should not exist)
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > document.body.clientWidth;
      });
      
      console.log(`Horizontal scroll detected: ${hasHorizontalScroll}`);
      
      // Generate a simple report
      const report = {
        timestamp: new Date().toISOString(),
        horizontalScrollDetected: hasHorizontalScroll,
        testsPassed: !hasHorizontalScroll,
        screenshots: [
          'screenshots/01-initial-load.png',
          'screenshots/02-after-auth.png',
          'screenshots/03-long-text-typed.png',
          'screenshots/04-long-text-sent.png',
          'screenshots/05-normal-text-sent.png',
          'screenshots/06-multiple-messages-final.png'
        ]
      };
      
      console.log('Test Report:', JSON.stringify(report, null, 2));
      
      // The main assertion
      expect(hasHorizontalScroll).toBe(false);
      
    } catch (error) {
      console.error('Test failed:', error);
      await page.screenshot({ path: 'screenshots/error-state.png', fullPage: true });
      throw error;
    }
  });
});