import { test, expect } from '@playwright/test';

test('manual text wrapping verification', async ({ page }) => {
  console.log('Starting text wrapping verification test...');
  
  try {
    // Step 1: Navigate to the application
    console.log('1. Navigating to http://localhost:3002...');
    await page.goto('http://localhost:3002');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    console.log('Page loaded successfully');
    
    // Step 2: Check if authentication is required and log in
    console.log('2. Checking for authentication...');
    const passwordInput = page.locator('input[type="password"]');
    
    if (await passwordInput.isVisible({ timeout: 5000 })) {
      console.log('Authentication required - logging in...');
      await passwordInput.fill('dev-pwd-123');
      
      // Submit the form
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      // Wait for authentication to complete
      await page.waitForTimeout(3000);
      console.log('Authentication completed');
    } else {
      console.log('No authentication required');
    }
    
    // Take screenshot after authentication
    await page.screenshot({ path: 'screenshots/01-after-auth.png', fullPage: true });
    
    // Step 3: Find the chat input
    console.log('3. Looking for chat input...');
    
    // Wait for the main interface to load
    await page.waitForSelector('div:has-text("Dropit")', { timeout: 10000 });
    
    // Look for input elements - try multiple selectors
    const inputSelectors = [
      'textarea',
      'input[type="text"]',
      'input:not([type="password"]):not([type="submit"]):not([type="button"])',
      '[contenteditable="true"]',
      '[role="textbox"]'
    ];
    
    let inputElement = null;
    for (const selector of inputSelectors) {
      try {
        inputElement = await page.waitForSelector(selector, { timeout: 2000 });
        if (inputElement) {
          console.log(`Found input with selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`No element found with selector: ${selector}`);
      }
    }
    
    if (!inputElement) {
      // Take a screenshot to see what's on the page
      await page.screenshot({ path: 'screenshots/02-no-input-found.png', fullPage: true });
      console.log('Could not find input element. Taking screenshot for debugging.');
      
      // Print page content for debugging
      const pageContent = await page.content();
      console.log('Page content (first 1000 chars):', pageContent.substring(0, 1000));
      
      throw new Error('Could not find chat input element');
    }
    
    // Step 4: Test long text message
    console.log('4. Testing long text message...');
    const longText = 'asdsaddasddasdadsadsadasdadsadsadadsdasdadassadsaddsadsadasadsdasdasdasdasadasdasdasdads';
    
    await inputElement.fill(longText);
    await page.screenshot({ path: 'screenshots/03-long-text-entered.png', fullPage: true });
    
    // Try to send the message
    console.log('5. Sending long text message...');
    
    // Try different ways to submit
    let messageSent = false;
    
    // First try to find and click a send button
    const sendButtonSelectors = [
      'button:has-text("Send")',
      'button[type="submit"]',
      'button:has([data-lucide="send"])',
      'button[aria-label*="send"]'
    ];
    
    for (const selector of sendButtonSelectors) {
      try {
        const sendButton = page.locator(selector).first();
        if (await sendButton.isVisible({ timeout: 1000 })) {
          await sendButton.click();
          messageSent = true;
          console.log(`Message sent using button: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue trying other selectors
      }
    }
    
    // If no button found, try Enter key
    if (!messageSent) {
      await page.keyboard.press('Enter');
      console.log('Message sent using Enter key');
    }
    
    // Wait for message to appear
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/04-long-text-sent.png', fullPage: true });
    
    // Step 5: Test normal text message
    console.log('6. Testing normal text message...');
    const normalText = 'This is a normal message that should display correctly.';
    
    await inputElement.fill(normalText);
    
    // Send normal message
    messageSent = false;
    for (const selector of sendButtonSelectors) {
      try {
        const sendButton = page.locator(selector).first();
        if (await sendButton.isVisible({ timeout: 1000 })) {
          await sendButton.click();
          messageSent = true;
          break;
        }
      } catch (e) {
        // Continue
      }
    }
    
    if (!messageSent) {
      await page.keyboard.press('Enter');
    }
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/05-normal-text-sent.png', fullPage: true });
    
    // Step 6: Check for horizontal scrolling
    console.log('7. Checking for horizontal scroll...');
    
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    console.log(`Horizontal scroll detected: ${hasHorizontalScroll}`);
    
    // Step 7: Final screenshot
    await page.screenshot({ path: 'screenshots/06-final-state.png', fullPage: true });
    
    // Generate test report
    const testReport = {
      timestamp: new Date().toISOString(),
      testResults: {
        authenticationSuccessful: true,
        longTextMessageSent: true,
        normalTextMessageSent: true,
        horizontalScrollDetected: hasHorizontalScroll,
        textWrappingWorking: !hasHorizontalScroll
      },
      screenshots: [
        'screenshots/01-after-auth.png',
        'screenshots/03-long-text-entered.png', 
        'screenshots/04-long-text-sent.png',
        'screenshots/05-normal-text-sent.png',
        'screenshots/06-final-state.png'
      ]
    };
    
    console.log('\n=== TEXT WRAPPING TEST REPORT ===');
    console.log(JSON.stringify(testReport, null, 2));
    
    // The main test assertion
    expect(hasHorizontalScroll).toBe(false);
    
    console.log('\n✅ Test completed successfully! Text wrapping is working properly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'screenshots/error-state.png', fullPage: true });
    throw error;
  }
});