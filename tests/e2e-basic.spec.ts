import { test, expect } from "@playwright/test";

test.describe("Dropit E2E Basic Tests", () => {
  test("should load the application and show login form", async ({ page }) => {
    await page.goto("/");

    // Check page title
    await expect(page).toHaveTitle(/Dropit/);

    // Check main elements are present
    await expect(page.locator("h1")).toContainText("Dropit");
    await expect(page.locator("h2")).toContainText("Login Account");

    // Check login form elements
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute(
      "placeholder",
      "Please enter access password",
    );

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText("Enter Dropit");
  });

  test("should have proper dark theme styling", async ({ page }) => {
    await page.goto("/");

    // Check dark background
    const darkBg = page.locator(".bg-\\[\\#1a1a1a\\]").first();
    await expect(darkBg).toBeVisible();

    // Check dark surface elements
    const darkSurface = page.locator(".bg-\\[\\#2d2d2d\\]").first();
    await expect(darkSurface).toBeVisible();

    // Check accent color
    const accentElement = page.locator(".bg-\\[\\#6366f1\\]").first();
    await expect(accentElement).toBeVisible();
  });

  test("should be responsive and mobile-friendly", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Should show mobile-optimized layout
    const container = page.locator(".max-w-sm");
    await expect(container).toBeVisible();

    // Should stack vertically
    const flexCol = page.locator(".flex-col");
    await expect(flexCol).toBeVisible();
  });

  test("should show validation error for empty password", async ({ page }) => {
    await page.goto("/");

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Should show validation error
    const errorText = page.locator(".text-red-400");
    await expect(errorText).toBeVisible();
    await expect(errorText).toContainText("Password cannot be empty");
  });

  test("should show loading state when submitting form", async ({ page }) => {
    await page.goto("/");

    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    // Fill in a password (any password to trigger loading state)
    await passwordInput.fill("testpassword");

    // Click submit
    await submitButton.click();

    // Should show loading state
    await expect(submitButton).toContainText("Verifying...");
    await expect(submitButton).toBeDisabled();

    // Should show spinner
    const spinner = page.locator(".animate-spin");
    await expect(spinner).toBeVisible();
  });

  test("should handle form interaction properly", async ({ page }) => {
    await page.goto("/");

    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    // Initially submit should be enabled (form validation happens on submit)
    await expect(submitButton).toBeEnabled();

    // Type in password field
    await passwordInput.fill("test123");
    await expect(passwordInput).toHaveValue("test123");

    // Clear password
    await passwordInput.clear();
    await expect(passwordInput).toHaveValue("");
  });

  test("should have proper accessibility elements", async ({ page }) => {
    await page.goto("/");

    // Check for proper semantic elements
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();

    const form = page.locator("form");
    await expect(form).toBeVisible();

    // Check input has proper type
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Check button has proper type
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toHaveAttribute("type", "submit");
  });

  test("should display proper branding and logo", async ({ page }) => {
    await page.goto("/");

    // Check for Dropit branding
    await expect(page.locator("h1")).toContainText("Dropit");

    // Check for logo/icon
    const logoIcon = page.locator("svg").first();
    await expect(logoIcon).toBeVisible();

    // Check subtitle
    const subtitle = page.locator(
      "text=Secure and fast temporary file sharing",
    );
    await expect(subtitle).toBeVisible();
  });

  test("should handle different screen sizes", async ({ page }) => {
    const sizes = [
      { width: 375, height: 667 }, // iPhone SE
      { width: 390, height: 844 }, // iPhone 12
      { width: 428, height: 926 }, // iPhone 12 Pro Max
      { width: 768, height: 1024 }, // iPad
      { width: 1024, height: 768 }, // iPad Landscape
    ];

    for (const size of sizes) {
      await page.setViewportSize(size);
      await page.goto("/");

      // Should maintain mobile-first layout
      const container = page.locator(".max-w-sm");
      await expect(container).toBeVisible();

      // Should show all main elements
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    }
  });

  test("should have proper footer", async ({ page }) => {
    await page.goto("/");

    // Check footer
    const footer = page.locator("text=© 2025 Dropit");
    await expect(footer).toBeVisible();
  });
});
