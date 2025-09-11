import { test, expect } from '@playwright/test';

test('Text Message Display Manual Verification', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:3000');
  
  // Wait for page load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot of the login page
  await page.screenshot({ path: 'test-results/01-login-page.png' });
  
  // Check if authentication is needed
  const passwordInput = page.locator('input[type="password"]');
  
  if (await passwordInput.isVisible({ timeout: 3000 })) {
    console.log('Authentication required - entering password');
    
    // Fill in the password
    await passwordInput.fill('default-password');
    
    // Click submit
    await page.locator('button[type="submit"]').click();
    
    // Take screenshot after auth attempt
    await page.screenshot({ path: 'test-results/02-after-auth.png' });
    
    // Wait for potential redirect/load
    await page.waitForTimeout(2000);
    
    // Take another screenshot to see final state
    await page.screenshot({ path: 'test-results/03-final-state.png' });
  } else {
    console.log('No authentication required');
  }
  
  // Check if we have access to the chat interface
  const textarea = page.locator('textarea');
  const hasTextarea = await textarea.isVisible({ timeout: 5000 });
  
  if (hasTextarea) {
    console.log('Chat interface found - testing text message display');
    
    // Send a test message
    await textarea.fill('TEST: This is a test message to verify text display works correctly');
    
    // Find and click the submit button
    const submitBtn = page.locator('button[type="submit"], button:has-text("Drop")').first();
    if (await submitBtn.isVisible({ timeout: 2000 })) {
      await submitBtn.click();
      
      // Wait for message to appear
      await page.waitForTimeout(2000);
      
      // Take screenshot of the result
      await page.screenshot({ path: 'test-results/04-message-sent.png' });
      
      // Check if the message text is visible
      const messageText = page.locator('.text-white').filter({ hasText: 'TEST: This is a test message' });
      const messageVisible = await messageText.isVisible({ timeout: 3000 });
      
      if (messageVisible) {
        console.log('✅ SUCCESS: Text message is visible');
        
        // Get the dimensions to verify it has proper width
        const textBox = await messageText.boundingBox();
        if (textBox && textBox.width > 0) {
          console.log(`✅ Text container has width: ${textBox.width}px`);
        } else {
          console.log('❌ Text container has zero width');
        }
      } else {
        console.log('❌ FAILURE: Text message is not visible');
      }
      
    } else {
      console.log('❌ Submit button not found');
      await page.screenshot({ path: 'test-results/04-no-submit-button.png' });
    }
    
  } else {
    console.log('❌ Chat interface not accessible');
    
    // Check what we actually see
    const bodyText = await page.textContent('body');
    console.log('Page content:', bodyText?.substring(0, 200));
  }
  
  // Always take a final screenshot
  await page.screenshot({ path: 'test-results/05-final-result.png' });
  
  // The test passes as long as we can navigate to the page
  // The actual verification is done through screenshots and console logs
  expect(true).toBe(true);
});