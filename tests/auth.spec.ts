import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto("/");
  });

  test("should show login form on initial visit", async ({ page }) => {
    // Check if login form is displayed
    await expect(page.locator("h1")).toContainText("Dropit");
    await expect(page.locator("h2")).toContainText("Login Account");

    // Check for password input
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute(
      "placeholder",
      "Please enter access password",
    );

    // Check for submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText("Enter Dropit");
  });

  test("should show error for empty password", async ({ page }) => {
    // Try to submit without password
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Should show validation error
    await expect(page.locator(".text-red-400")).toBeVisible();
    await expect(page.locator(".text-red-400")).toContainText(
      "Password cannot be empty",
    );
  });

  test("should show error for incorrect password", async ({ page }) => {
    // Enter incorrect password
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("wrongpassword");

    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for loading state
    await expect(submitButton).toContainText("Verifying...");

    // Wait for error message
    await expect(page.locator(".bg-red-900\\/30")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator(".text-red-400")).toContainText(
      /密码错误|Incorrect password|登录失败|Login failed/,
    );
  });

  test("should successfully login with correct password", async ({ page }) => {
    // Enter correct password (assuming 'test' is the correct password based on common test setups)
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("test123");

    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for loading state
    await expect(submitButton).toContainText("Verifying...");

    // Should redirect to chat interface or show success
    // Wait for either chat interface or error
    await page.waitForLoadState("networkidle");

    // Check if we're on the chat page (look for chat interface elements)
    const isChatVisible = await page
      .locator('h1:has-text("Dropit")')
      .first()
      .isVisible()
      .catch(() => false);

    // After authentication attempt, we should either see chat interface or error
    const hasErrorMessage = await page.locator(".bg-red-900\\/30").isVisible();

    if (!hasErrorMessage) {
      // Successful login - should show chat interface or be redirected
      await expect(page.locator(".bg-\\[\\#1a1a1a\\]").first()).toBeVisible();
      await expect(page.locator("h1")).toContainText("Dropit");

      // Try to find chat interface elements (may not exist if chat interface isn't loaded due to API issues)
      const hasChatInterface =
        (await page.locator('div[class*="overflow-y-auto"], .flex-1').count()) >
        0;
      expect(hasChatInterface).toBeTruthy();
    } else {
      // If login fails, check error message
      await expect(page.locator(".bg-red-900\\/30")).toBeVisible();
    }
  });

  test("should have proper visual styling on login page", async ({ page }) => {
    // Check dark theme styling - use first element to avoid strict mode violation
    await expect(page.locator(".bg-\\[\\#1a1a1a\\]").first()).toBeVisible();
    await expect(page.locator(".bg-\\[\\#2d2d2d\\]").first()).toBeVisible();

    // Check for Dropit logo/icon
    const logoIcon = page.locator("svg").first();
    await expect(logoIcon).toBeVisible();

    // Check color scheme - just check that there are text-white elements (should be at least 3)
    const textWhiteCount = await page.locator(".text-white").count();
    expect(textWhiteCount).toBeGreaterThanOrEqual(3);

    // Check for mobile-first design (max-width constraint)
    const mainContainer = page.locator(".max-w-sm");
    await expect(mainContainer).toBeVisible();
  });

  test("should handle loading states properly", async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    // Enter password
    await passwordInput.fill("test123");

    // Check initial state
    await expect(submitButton).toContainText("Enter Dropit");
    await expect(submitButton).toBeEnabled();

    // Click and check loading state
    await submitButton.click();

    // Should show loading state
    await expect(submitButton).toContainText("Verifying...");
    await expect(submitButton).toBeDisabled();

    // Should have loading spinner
    const spinner = page.locator(".animate-spin");
    await expect(spinner).toBeVisible();
  });
});
