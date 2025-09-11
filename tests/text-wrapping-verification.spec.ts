import { test, expect } from '@playwright/test';

test.describe('Text Wrapping Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3002');
    
    // Wait for the application to load
    await page.waitForSelector('div:has-text("Dropit")');
    
    // Check if we need to authenticate (look for password field)
    const passwordField = page.locator('input[type="password"]');
    if (await passwordField.isVisible({ timeout: 5000 })) {
      // Enter password - assuming default password or empty for testing
      // You may need to adjust this based on your actual password
      await passwordField.fill('your-password-here');
      await page.keyboard.press('Enter');
      
      // Wait for authentication to complete
      await page.waitForSelector('div:has-text("Dropit")', { timeout: 10000 });
    }
    
    // Wait for the main chat interface to load
    await page.waitForSelector('[data-testid="chat-input"]', { timeout: 10000 });
  });

  test('should wrap long text messages properly within container boundaries', async ({ page }) => {
    const longText = 'asdsaddasddasdadsadsadasdadsadsadadsdasdadassadsaddsadsadasadsdasdasdasdasadasdasdasdads';
    
    // Find the text input field
    const textInput = page.locator('textarea, input[type="text"], [contenteditable="true"]').first();
    await textInput.fill(longText);
    
    // Submit the message
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    await sendButton.click();
    
    // Wait for the message to appear
    await page.waitForSelector(`text=${longText}`, { timeout: 5000 });
    
    // Find the message container
    const messageElement = page.locator(`text=${longText}`).first();
    const messageContainer = messageElement.locator('..').first();
    
    // Get the bounding boxes
    const containerBox = await messageContainer.boundingBox();
    const textBox = await messageElement.boundingBox();
    
    expect(containerBox).not.toBeNull();
    expect(textBox).not.toBeNull();
    
    if (containerBox && textBox) {
      // Verify that the text doesn't overflow horizontally beyond the container
      expect(textBox.x).toBeGreaterThanOrEqual(containerBox.x);
      expect(textBox.x + textBox.width).toBeLessThanOrEqual(containerBox.x + containerBox.width + 5); // 5px tolerance
      
      // The message should be taller than a single line (indicating wrapping occurred)
      expect(textBox.height).toBeGreaterThan(25); // Assuming minimum line height
    }
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'test-results/long-text-wrapping.png', fullPage: true });
  });

  test('should display normal text correctly without issues', async ({ page }) => {
    const normalText = 'This is a normal message that should display correctly without any wrapping issues.';
    
    // Find the text input field
    const textInput = page.locator('textarea, input[type="text"], [contenteditable="true"]').first();
    await textInput.fill(normalText);
    
    // Submit the message
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    await sendButton.click();
    
    // Wait for the message to appear
    await page.waitForSelector(`text=${normalText}`, { timeout: 5000 });
    
    // Find the message element
    const messageElement = page.locator(`text=${normalText}`).first();
    
    // Verify the message is visible and readable
    await expect(messageElement).toBeVisible();
    await expect(messageElement).toContainText(normalText);
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'test-results/normal-text-display.png', fullPage: true });
  });

  test('should handle multiple long text messages without layout breaking', async ({ page }) => {
    const messages = [
      'First long message: asdsaddasddasdadsadsadasdadsadsadadsdasdadassadsaddsadsadasadsdasdasdasdasadasdasdasdads',
      'Second message with different length: verylongwordwithoutspacesthatshouldalsobehandledproperlybythetextvrappingmechanism',
      'Third normal message',
      'Fourth extremely long message: thisisaverylongmessagethatcontainsmultiplewordsthatarealsoverylongandshouldalllwrapproperlywithinthecontainerboundarieswithoutcausinganyoverflowissues'
    ];
    
    // Send multiple messages
    for (const message of messages) {
      const textInput = page.locator('textarea, input[type="text"], [contenteditable="true"]').first();
      await textInput.fill(message);
      
      const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
      await sendButton.click();
      
      // Wait for message to appear
      await page.waitForSelector(`text=${message}`, { timeout: 5000 });
      await page.waitForTimeout(1000); // Brief pause between messages
    }
    
    // Verify all messages are displayed and properly wrapped
    for (const message of messages) {
      const messageElement = page.locator(`text=${message}`).first();
      await expect(messageElement).toBeVisible();
      
      // Check that no horizontal scrollbar appears on the page
      const body = page.locator('body');
      const hasHorizontalScroll = await body.evaluate((el) => el.scrollWidth > el.clientWidth);
      expect(hasHorizontalScroll).toBe(false);
    }
    
    // Take a final screenshot showing all messages
    await page.screenshot({ path: 'test-results/multiple-messages-wrapping.png', fullPage: true });
  });
});