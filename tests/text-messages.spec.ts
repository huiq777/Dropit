import { test, expect } from '@playwright/test';

test.describe('Dropit Text Messages', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Handle authentication
    const authForm = page.locator('form').first();
    if (await authForm.isVisible()) {
      const passwordInput = page.locator('input[type="password"]');
      await passwordInput.fill('dev-pwd-123');
      const submitBtn = page.locator('button[type="submit"]').first();
      await submitBtn.click();
      
      // Wait for authentication to complete and main chat interface to appear
      await page.waitForSelector('textarea[placeholder*="Input text content"]', { timeout: 15000 });
      await page.waitForTimeout(1000); // Additional wait for interface to be fully ready
    } else {
      // If no auth form, still wait for chat interface
      await page.waitForSelector('textarea[placeholder*="Input text content"]', { timeout: 15000 });
    }
  });

  test('should display short text messages correctly', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder*="Input text content"]');
    const sendButton = page.locator('button[type="submit"]:has-text("Drop")');
    
    // Send a short text message
    await chatInput.fill('test');
    await sendButton.click();
    
    // Wait for message to appear and verify visibility
    await page.waitForTimeout(2000);
    
    // Check that message container appears
    const messageContainers = page.locator('div[class*="bg-gradient-to-br from-[#2a2d3e]"]');
    await expect(messageContainers).toHaveCount(1);
    
    // Check that the text content is visible
    const messageText = page.locator('text=test');
    await expect(messageText).toBeVisible();
    
    // Verify the message has proper text styling
    const textElement = page.locator('div[class*="text-white"][class*="break-words"]').first();
    await expect(textElement).toBeVisible();
    await expect(textElement).toHaveText('test');
  });

  test('should display long text messages with proper wrapping', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder*="Input text content"]');
    const sendButton = page.locator('button[type="submit"]:has-text("Drop")');
    
    const longMessage = 'This is a very long text message that should wrap properly within the container and not exceed the boundaries of the text box. It should display correctly with proper line breaks and text wrapping to ensure readability.';
    
    // Send a long text message
    await chatInput.fill(longMessage);
    await sendButton.click();
    
    // Wait for message to appear
    await page.waitForTimeout(2000);
    
    // Check that message container appears
    const messageContainers = page.locator('div[class*="bg-gradient-to-br from-[#2a2d3e]"]');
    await expect(messageContainers).toHaveCount(1);
    
    // Check that the long text content is visible (check for a substring)
    const messageText = page.locator('text="This is a very long text message"');
    await expect(messageText).toBeVisible();
    
    // Verify proper text wrapping styles are applied
    const textElement = page.locator('div[class*="text-white"][class*="break-words"]').first();
    await expect(textElement).toBeVisible();
    
    // Check computed styles for text wrapping
    const styles = await textElement.evaluate((el) => {
      const computedStyles = window.getComputedStyle(el);
      return {
        whiteSpace: computedStyles.whiteSpace,
        wordWrap: computedStyles.wordWrap,
        overflowWrap: computedStyles.overflowWrap,
      };
    });
    
    expect(styles.whiteSpace).toBe('pre-wrap');
    expect(styles.wordWrap).toBe('break-word');
    expect(styles.overflowWrap).toBe('break-word');
  });

  test('should display multiple text messages in sequence', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder*="Input text content"]');
    const sendButton = page.locator('button[type="submit"]:has-text("Drop")');
    
    // Send first message
    await chatInput.fill('First message');
    await sendButton.click();
    await page.waitForTimeout(1000);
    
    // Send second message
    await chatInput.fill('Second message with more content');
    await sendButton.click();
    await page.waitForTimeout(1000);
    
    // Send third message
    await chatInput.fill('Third and final test message');
    await sendButton.click();
    await page.waitForTimeout(2000);
    
    // Verify all three messages are visible
    const messageContainers = page.locator('div[class*="bg-gradient-to-br from-[#2a2d3e]"]');
    await expect(messageContainers).toHaveCount(3);
    
    // Verify specific message content
    await expect(page.locator('text="First message"')).toBeVisible();
    await expect(page.locator('text="Second message with more content"')).toBeVisible();
    await expect(page.locator('text="Third and final test message"')).toBeVisible();
  });

  test('should have proper message layout and styling', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder*="Input text content"]');
    const sendButton = page.locator('button[type="submit"]:has-text("Drop")');
    
    // Send a test message
    await chatInput.fill('Layout test message');
    await sendButton.click();
    await page.waitForTimeout(2000);
    
    // Check message container has proper styling
    const messageContainer = page.locator('div[class*="bg-gradient-to-br from-[#2a2d3e]"]').first();
    await expect(messageContainer).toBeVisible();
    
    // Check for the text icon (Type component)
    const textIcon = messageContainer.locator('svg').first();
    await expect(textIcon).toBeVisible();
    
    // Check for copy button (should appear on hover)
    const copyButton = messageContainer.locator('button[title*="Copy"]');
    await expect(copyButton).toBeAttached();
    
    // Test copy functionality
    await messageContainer.hover();
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    
    // Check for success feedback
    const checkIcon = messageContainer.locator('svg[class*="w-4 h-4"]');
    await expect(checkIcon).toBeVisible();
  });

  test('should handle empty message submission', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder*="Input text content"]');
    const sendButton = page.locator('button[type="submit"]:has-text("Drop")');
    
    // Try to send empty message
    await chatInput.fill('');
    
    // Send button should be disabled for empty input
    await expect(sendButton).toBeDisabled();
    
    // Try with only whitespace
    await chatInput.fill('   ');
    await expect(sendButton).toBeDisabled();
  });

  test('should clear input after sending message', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder*="Input text content"]');
    const sendButton = page.locator('button[type="submit"]:has-text("Drop")');
    
    // Send a message
    await chatInput.fill('Test message for input clearing');
    await sendButton.click();
    await page.waitForTimeout(1000);
    
    // Input should be cleared
    await expect(chatInput).toHaveValue('');
  });
});