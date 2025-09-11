import { test, expect } from '@playwright/test';

test.describe('Text Message Display Fix Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
    
    // Wait for the application to load
    await page.waitForLoadState('networkidle');
    
    // Handle authentication - use default password
    const authForm = page.locator('input[type="password"]');
    if (await authForm.isVisible({ timeout: 5000 })) {
      await authForm.fill('default-password');
      await page.locator('button[type="submit"]').click();
      
      // Wait for authentication to complete
      await page.waitForLoadState('networkidle');
      
      // Wait for chat interface to load
      await page.waitForSelector('textarea', { timeout: 10000 });
    }
  });

  test('should display short text messages correctly', async ({ page }) => {
    const shortMessage = 'test';
    
    // Send a short text message
    const textArea = page.locator('textarea').first();
    await textArea.fill(shortMessage);
    
    // Submit the message
    const submitButton = page.locator('button[type="submit"], button:has-text("Drop")').first();
    await submitButton.click();
    
    // Wait for the message to appear
    await page.waitForTimeout(1000);
    
    // Verify the message is visible in the chat
    const messageElement = page.locator('.text-white').filter({ hasText: shortMessage });
    await expect(messageElement).toBeVisible();
    
    // Verify the message has proper text styling
    await expect(messageElement).toHaveCSS('color', /rgb\(255,\s?255,\s?255\)/);
    
    // Take screenshot for verification
    await page.screenshot({ path: 'test-results/short-text-message.png' });
  });

  test('should display long text messages with proper wrapping', async ({ page }) => {
    const longMessage = 'This is a very long test message that should wrap properly and remain visible in the chat interface. It contains multiple sentences to test text wrapping behavior and ensure that all content remains readable regardless of length.';
    
    // Send a long text message
    const textArea = page.locator('textarea').first();
    await textArea.fill(longMessage);
    
    // Submit the message
    const submitButton = page.locator('button[type="submit"], button:has-text("Drop")').first();
    await submitButton.click();
    
    // Wait for the message to appear
    await page.waitForTimeout(1000);
    
    // Verify the message is visible in the chat
    const messageElement = page.locator('.text-white').filter({ hasText: longMessage });
    await expect(messageElement).toBeVisible();
    
    // Verify text wrapping is working (element should have multiple lines)
    const messageBox = messageElement.boundingBox();
    expect(messageBox?.height).toBeGreaterThan(30); // Multiple lines should be taller
    
    // Take screenshot for verification
    await page.screenshot({ path: 'test-results/long-text-message.png' });
  });

  test('should show text message container with proper dimensions', async ({ page }) => {
    const testMessage = 'Container test message';
    
    // Send a message
    const textArea = page.locator('textarea').first();
    await textArea.fill(testMessage);
    const submitButton = page.locator('button[type="submit"], button:has-text("Drop")').first();
    await submitButton.click();
    
    // Wait for the message to appear
    await page.waitForTimeout(1000);
    
    // Find the text container (should have flex-1 class but NOT max-w-0)
    const textContainer = page.locator('.flex-1.min-w-0.overflow-hidden').first();
    await expect(textContainer).toBeVisible();
    
    // Verify the container has proper width (not zero width)
    const containerBox = await textContainer.boundingBox();
    expect(containerBox?.width).toBeGreaterThan(0);
    
    // Verify the text content is visible within the container
    const textContent = textContainer.locator('.text-white');
    await expect(textContent).toBeVisible();
    await expect(textContent).toContainText(testMessage);
  });

  test('should display multiple messages correctly', async ({ page }) => {
    const messages = ['First message', 'Second longer message with more text', 'Third'];
    
    // Send multiple messages
    for (const message of messages) {
      const textArea = page.locator('textarea').first();
      await textArea.fill(message);
      const submitButton = page.locator('button[type="submit"], button:has-text("Drop")').first();
      await submitButton.click();
      await page.waitForTimeout(500);
    }
    
    // Verify all messages are visible
    for (const message of messages) {
      const messageElement = page.locator('.text-white').filter({ hasText: message });
      await expect(messageElement).toBeVisible();
    }
    
    // Take screenshot of multiple messages
    await page.screenshot({ path: 'test-results/multiple-text-messages.png' });
  });

  test('should allow copying text messages', async ({ page }) => {
    const testMessage = 'Copy test message';
    
    // Send a message
    const textArea = page.locator('textarea').first();
    await textArea.fill(testMessage);
    const submitButton = page.locator('button[type="submit"], button:has-text("Drop")').first();
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Find and hover over the message to reveal copy button
    const messageGroup = page.locator('.group').filter({ has: page.locator('.text-white', { hasText: testMessage }) });
    await messageGroup.hover();
    
    // Click the copy button
    const copyButton = messageGroup.locator('button[title*="Copy" i], button:has(svg)').first();
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    
    // Verify copy feedback (check for success state)
    await expect(copyButton).toHaveClass(/text-green-400|bg-green-400/);
  });

  test('should handle special characters in text messages', async ({ page }) => {
    const specialMessage = 'Special chars: àáâãäåæçèéêë 你好 🎉 @#$%^&*()';
    
    // Send message with special characters
    const textArea = page.locator('textarea').first();
    await textArea.fill(specialMessage);
    const submitButton = page.locator('button[type="submit"], button:has-text("Drop")').first();
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Verify the message displays correctly with all special characters
    const messageElement = page.locator('.text-white').filter({ hasText: specialMessage });
    await expect(messageElement).toBeVisible();
    await expect(messageElement).toContainText(specialMessage);
  });
});