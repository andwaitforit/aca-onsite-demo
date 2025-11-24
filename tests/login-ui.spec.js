const { test, expect } = require('@playwright/test');

/**
 * UI Auto-Healing Demo - Intentionally Brittle Test
 * 
 * Purpose: Demonstrate how Playwright tests break when UI elements change
 * This test uses VERY SPECIFIC selectors that will fail when:
 * - Button text changes from "Login" to "Sign In"
 * - CSS classes change from "btn auth-button" to "btn-primary login-btn"
 * - HTML structure changes (icon additions, span wrappers)
 * 
 * Compare with mabl test which will auto-heal through these changes
 */

const CLIENT_EMAIL = 'admin';
const CLIENT_PASSWORD = 'admin';

test.describe('Login UI - Brittle Selectors (Demo)', () => {
  test('should login with specific button selector that breaks on UI changes', async ({ page }) => {
    console.log('========================================');
    console.log('UI Auto-Healing Demo - Playwright Test');
    console.log('========================================');
    console.log('');
    
    // Navigate to login page
    console.log('Step 1: Navigate to login page');
    await page.goto('/');
    await page.waitForSelector('#login-page');
    console.log('✓ Login page loaded');
    
    // Fill username
    console.log('Step 2: Fill username');
    await page.fill('#username', CLIENT_EMAIL);
    console.log(`✓ Username filled: ${CLIENT_EMAIL}`);
    
    // Fill password
    console.log('Step 3: Fill password');
    await page.fill('#password', CLIENT_PASSWORD);
    console.log('✓ Password filled');
    
    // Click login button using BRITTLE SELECTOR
    // This will FAIL after UI changes because:
    // 1. Text "Login" changes to "Sign In"
    // 2. Class "btn" changes to "btn-primary"
    // 3. Class "auth-button" is removed
    console.log('Step 4: Click login button (using brittle selector)');
    console.log('Selector: button.btn.auth-button:has-text("Login")');
    
    try {
      const loginButton = page.locator('button.btn.auth-button:has-text("Login")');
      await loginButton.click({ timeout: 5000 });
      console.log('✓ Login button clicked');
    } catch (error) {
      console.log('✗ FAILED: Cannot find login button with current selector');
      console.log('');
      console.log('Expected behavior:');
      console.log('  Original UI: ✓ PASS');
      console.log('  Modified UI: ✗ FAIL ← You are here');
      console.log('  Reset UI:    ✓ PASS');
      console.log('');
      console.log('Why it failed:');
      console.log('  - Button text changed: "Login" → "Sign In"');
      console.log('  - Button classes changed: "btn auth-button" → "btn-primary login-btn"');
      console.log('  - HTML structure changed: Added icon, new span wrapper');
      console.log('');
      console.log('mabl auto-heals through these changes! 🎯');
      throw error;
    }
    
    // Verify successful login
    console.log('Step 5: Verify successful login');
    const homeLink = page.getByRole('link', { name: 'Home' });
    await expect(homeLink).toBeVisible({ timeout: 10000 });
    console.log('✓ Home link visible - login successful!');
    console.log('');
    console.log('========================================');
    console.log('Test Result: PASS ✓');
    console.log('========================================');
  });

  test('should fail when button text changes (alternate demonstration)', async ({ page }) => {
    // Navigate and fill credentials
    await page.goto('/');
    await page.fill('#username', CLIENT_EMAIL);
    await page.fill('#password', CLIENT_PASSWORD);
    
    // This alternate brittle selector also breaks
    // Uses text content which changes from "Login" to "Sign In"
    const loginButton = page.locator('button:has-text("Login")');
    
    // This will work on original, fail on modified UI
    await expect(loginButton).toBeVisible({ timeout: 5000 });
    await loginButton.click();
    
    // Verify login
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  });

  test('should fail when data-testid changes (third demonstration)', async ({ page }) => {
    // Navigate and fill credentials
    await page.goto('/');
    await page.fill('#username', CLIENT_EMAIL);
    await page.fill('#password', CLIENT_PASSWORD);
    
    // This selector relies on data-testid="auth-submit"
    // Modified UI changes it to data-testid="signin-button"
    const loginButton = page.getByTestId('auth-submit');
    
    // This will work on original, fail on modified UI
    await expect(loginButton).toBeVisible({ timeout: 5000 });
    await loginButton.click();
    
    // Verify login
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  });
});

test.describe('Login UI - Robust Selectors (Reference)', () => {
  test('should work with semantic selectors (more resilient but not perfect)', async ({ page }) => {
    // This test shows a more resilient approach using semantic selectors
    // However, it's still not as resilient as mabl's AI-powered auto-healing
    
    await page.goto('/');
    await page.fill('#username', CLIENT_EMAIL);
    await page.fill('#password', CLIENT_PASSWORD);
    
    // Using semantic role and form context - more resilient
    // This MIGHT survive the UI changes, but requires careful test design
    const loginButton = page.locator('form button[type="submit"]');
    await loginButton.click();
    
    // Verify login
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  });
});

