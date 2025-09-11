const { chromium } = require('playwright');

async function testTextMessages() {
  console.log('Starting text message testing...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Step 1: Navigate to application
    console.log('1. Navigating to http://localhost:3000');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ path: 'screenshots/01-initial-load.png', fullPage: true });
    
    // Step 2: Handle authentication if needed
    console.log('2. Checking for authentication...');
    const authForm = page.locator('form').first();
    
    if (await authForm.isVisible()) {
      console.log('   Authentication form detected, trying passwords...');
      
      // Try common passwords
      const passwords = ["dev-pwd-123", "default-password", "password", "123456"];
      let authenticated = false;
      
      for (const pwd of passwords) {
        console.log(`   Trying password: ${pwd}`);
        const passwordInput = page.locator('input[type="password"]');
        
        if (await passwordInput.isVisible()) {
          await passwordInput.fill(pwd);
          const submitBtn = page.locator('button[type="submit"]').first();
          await submitBtn.click();
          await page.waitForTimeout(3000);
          
          // Check if main chat interface appeared (look for the distinctive text input)
          const chatInput = page.locator('textarea[placeholder*="Input text content"]');
          if (await chatInput.isVisible()) {
            console.log(`   ✓ Successfully authenticated with: ${pwd}`);
            authenticated = true;
            break;
          }
          
          // Also check if auth form is gone as backup
          if (!(await authForm.isVisible())) {
            console.log(`   ✓ Successfully authenticated with: ${pwd} (form disappeared)`);
            authenticated = true;
            break;
          }
        }
      }
      
      if (!authenticated) {
        throw new Error('Could not authenticate with any of the tried passwords');
      }
    } else {
      console.log('   No authentication required or already authenticated');
    }
    
    // Take screenshot after auth
    await page.screenshot({ path: 'screenshots/02-after-auth.png', fullPage: true });
    
    // Step 3: Wait for the main chat interface to load
    console.log('3. Waiting for main chat interface...');
    await page.waitForSelector('div[class*="bg-[#1a1a1a]"]', { timeout: 10000 });
    
    // Look for chat input area
    const chatInput = page.locator('textarea[placeholder*="Input text content"]');
    await chatInput.waitFor({ state: 'visible', timeout: 10000 });
    
    console.log('   ✓ Main chat interface loaded');
    
    // Step 4: Send a short text message
    console.log('4. Sending short text message...');
    await chatInput.fill('test');
    
    // Look for send button (the "Drop" button with the arrow icon)
    const sendButton = page.locator('button[type="submit"]:has-text("Drop")');
    await sendButton.click();
    
    // Wait for message to appear
    await page.waitForTimeout(2000);
    
    // Take screenshot after short message
    await page.screenshot({ path: 'screenshots/03-short-message.png', fullPage: true });
    
    // Step 5: Verify short message is visible
    console.log('5. Verifying short message visibility...');
    const messageText = page.locator('text=test');
    const isShortMessageVisible = await messageText.isVisible();
    console.log(`   Short message visible: ${isShortMessageVisible}`);
    
    // Step 6: Send a long text message
    console.log('6. Sending long text message...');
    const longMessage = 'This is a very long text message that should wrap properly within the container and not exceed the boundaries of the text box. It should display correctly with proper line breaks and text wrapping to ensure readability.';
    
    await chatInput.fill(longMessage);
    await sendButton.click();
    
    // Wait for message to appear
    await page.waitForTimeout(2000);
    
    // Take screenshot after long message
    await page.screenshot({ path: 'screenshots/04-long-message.png', fullPage: true });
    
    // Step 7: Verify long message visibility and wrapping
    console.log('7. Verifying long message visibility and wrapping...');
    
    // Look for any element containing part of the long message
    const longMessageElement = page.locator(`text="${longMessage.substring(0, 50)}"`);
    const isLongMessageVisible = await longMessageElement.isVisible();
    console.log(`   Long message visible: ${isLongMessageVisible}`);
    
    // Step 8: Check if messages are in the chat area
    console.log('8. Analyzing chat message structure...');
    
    // Look for message containers based on the ChatMessage component structure
    const messageContainers = page.locator('div[class*="bg-gradient-to-br from-[#2a2d3e]"]');
    const messageCount = await messageContainers.count();
    console.log(`   Found ${messageCount} message containers`);
    
    // Check text content in message containers
    for (let i = 0; i < Math.min(messageCount, 5); i++) {
      const container = messageContainers.nth(i);
      const textContent = await container.textContent();
      console.log(`   Message ${i + 1} content preview: ${textContent?.substring(0, 100)}...`);
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'screenshots/05-final-state.png', fullPage: true });
    
    // Step 9: Check for any text wrapping issues
    console.log('9. Checking text wrapping and styling...');
    
    // Look for text elements and check their styling
    const textElements = page.locator('div[class*="text-white"][class*="break-words"]');
    const textElementCount = await textElements.count();
    console.log(`   Found ${textElementCount} text elements with wrapping classes`);
    
    // Analyze specific styling
    if (textElementCount > 0) {
      const firstTextElement = textElements.first();
      const computedStyles = await firstTextElement.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          whiteSpace: styles.whiteSpace,
          wordWrap: styles.wordWrap,
          overflowWrap: styles.overflowWrap,
          overflow: styles.overflow,
          display: styles.display,
        };
      });
      console.log('   Text element computed styles:', computedStyles);
    }
    
    console.log('\n=== TESTING COMPLETE ===');
    console.log(`Short message visible: ${isShortMessageVisible}`);
    console.log(`Long message visible: ${isLongMessageVisible}`);
    console.log(`Total message containers found: ${messageCount}`);
    console.log('Screenshots saved to screenshots/ directory');
    
    if (!isShortMessageVisible || !isLongMessageVisible) {
      console.log('\n❌ ISSUE DETECTED: Text messages are not showing as expected');
    } else {
      console.log('\n✅ SUCCESS: Text messages are displaying correctly');
    }
    
  } catch (error) {
    console.error('Error during testing:', error);
    await page.screenshot({ path: 'screenshots/error-state.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

// Create screenshots directory
const fs = require('fs');
if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}

// Run the test
testTextMessages().catch(console.error);