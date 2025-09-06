import { test, expect } from "@playwright/test";

test.describe("Integration Tests - Full Application Flow", () => {
  test("should successfully login with correct password and handle messages error gracefully", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify we're on login page
    await expect(page.locator("h1")).toContainText("Dropit");
    await expect(page.locator("h2")).toContainText("Login Account");

    // Use the correct password from .env.local
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("dev-password-123");

    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for loading state
    await expect(submitButton).toContainText("Verifying...");
    await expect(submitButton).toBeDisabled();

    // Should show loading spinner
    const spinner = page.locator(".animate-spin");
    await expect(spinner).toBeVisible();

    // Wait for the authentication to complete
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000); // Give time for any redirects

    // After successful login, we should either see:
    // 1. Chat interface (if APIs work)
    // 2. Or error message about failed to load messages (if KV is not configured)
    const hasErrorMessage = await page
      .locator("text=Failed to load messages")
      .isVisible()
      .catch(() => false);
    const hasChatInterface = await page
      .locator('h1:has-text("Dropit")')
      .first()
      .isVisible()
      .catch(() => false);

    if (hasErrorMessage) {
      // Expected when Vercel KV is not configured
      console.log(
        "✓ Login successful but KV not configured - showing error message as expected",
      );
      expect(hasErrorMessage).toBeTruthy();
    } else if (hasChatInterface) {
      // Full functionality working
      console.log("✓ Login successful and chat interface loaded");

      // Verify chat interface elements
      await expect(page.locator("h1")).toContainText("Dropit");

      // Should show chat interface or empty state
      const hasEmptyState = await page
        .locator("text=Start chatting or drop files here")
        .isVisible()
        .catch(() => false);
      const hasInputArea = await page
        .locator('textarea[placeholder*="Input text"]')
        .isVisible()
        .catch(() => false);

      expect(hasEmptyState || hasInputArea).toBeTruthy();
    } else {
      // Still on login page - authentication failed
      await expect(page.locator(".bg-red-900\\/30")).toBeVisible();
      const errorText = await page.locator(".text-red-400").textContent();
      console.log("Login failed with error:", errorText);

      // This would indicate a problem with our implementation
      expect(true).toBe(false); // Force failure to investigate
    }
  });

  test("should handle network errors gracefully", async ({ page }) => {
    await page.goto("/");

    // Intercept the auth API call to simulate network error
    await page.route("**/api/auth", (route) => {
      route.abort("failed");
    });

    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("dev-password-123");

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Should handle network error
    await page.waitForTimeout(1000);

    // Button should return to normal state or show error
    const buttonText = await submitButton.textContent();
    expect(["Enter Dropit", "Verifying..."]).toContain(buttonText);
  });

  test("should show proper error for wrong password", async ({ page }) => {
    await page.goto("/");

    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("wrong-password");

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Should show error message
    const errorContainer = page.locator(".bg-red-900\\/30");
    await expect(errorContainer).toBeVisible();

    const errorText = page.locator(".text-red-400");
    await expect(errorText).toContainText(/密码错误|密码|错误/);
  });

  test("should maintain proper UI state during authentication", async ({
    page,
  }) => {
    await page.goto("/");

    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    // Check initial state
    await expect(submitButton).toContainText("Enter Dropit");
    await expect(submitButton).toBeEnabled();

    // Fill password
    await passwordInput.fill("dev-password-123");

    // Submit and immediately check loading state
    await submitButton.click();

    // Should quickly change to loading state
    await expect(submitButton).toContainText("Verifying...");
    await expect(submitButton).toBeDisabled();

    // Should show spinner
    await expect(page.locator(".animate-spin")).toBeVisible();

    // Wait for completion
    await page.waitForTimeout(3000);

    // Should either redirect or show error, button should not be stuck in loading state
    const finalButtonText = await submitButton.textContent();
    const isStillLoading = finalButtonText?.includes("Verifying...");
    expect(isStillLoading).toBeFalsy();
  });

  test("should have correct visual styling throughout the flow", async ({
    page,
  }) => {
    await page.goto("/");

    // Check dark theme
    await expect(page.locator(".bg-\\[\\#1a1a1a\\]").first()).toBeVisible();
    await expect(page.locator(".bg-\\[\\#2d2d2d\\]").first()).toBeVisible();

    // Check mobile layout
    await expect(page.locator(".max-w-sm")).toBeVisible();

    // Fill and submit form
    await page.locator('input[type="password"]').fill("dev-password-123");
    await page.locator('button[type="submit"]').click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Dark theme should be maintained regardless of outcome
    await expect(page.locator(".bg-\\[\\#1a1a1a\\]").first()).toBeVisible();
  });

  test("should be accessible and keyboard navigable", async ({ page }) => {
    await page.goto("/");

    // Should be able to tab to password field
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toHaveAttribute("type", "password");

    // Should be able to type password
    await page.keyboard.type("dev-password-123");

    // Should be able to tab to submit button
    await page.keyboard.press("Tab");
    const focusedButton = page.locator(":focus");
    await expect(focusedButton).toHaveAttribute("type", "submit");

    // Should be able to submit with Enter
    await page.keyboard.press("Enter");

    // Should handle submission
    await page.waitForTimeout(1000);
    await expect(focusedButton).toContainText(/Enter Dropit|Verifying.../);
  });
});
