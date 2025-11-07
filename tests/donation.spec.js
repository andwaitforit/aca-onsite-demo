const { test, expect } = require('@playwright/test');

test.describe('Sweetums Charity Donation Feature', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    
    // Login
    await page.fill('#username', 'user');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should deduct donation amount from account balance', async ({ page }) => {
    // Navigate to withdraw page
    await page.click('text=Withdraw');
    await expect(page.locator('h1:has-text("withdraw")')).toBeVisible();
    
    // Select an account
    await page.selectOption('select[name="account"]', { index: 1 });
    
    // Wait for balance to load
    await page.waitForTimeout(500);
    
    // Get initial balance
    const balanceInput = page.locator('input[type="text"].right').first();
    const initialBalanceText = await balanceInput.inputValue();
    const initialBalance = parseFloat(initialBalanceText.replace(/,/g, ''));
    
    console.log(`Initial balance: $${initialBalance.toFixed(2)}`);
    
    // Enter withdrawal amount
    const withdrawalAmount = 50;
    await page.fill('input[name="amount"]', withdrawalAmount.toString());
    
    // Enable donation (fixed $5 donation) - click the text to toggle
    await page.click('text=Donate $5 to Sweetums Charity');
    const donationAmount = 5; // Fixed $5 donation
    
    // Submit the withdrawal
    await page.click('button.btn');
    
    // Wait for success message
    await expect(page.locator('.success')).toBeVisible();
    await expect(page.locator('text=Sweetums Charity')).toBeVisible();
    
    // Wait a moment for React state to update and re-render
    await page.waitForTimeout(1000);
    
    // Verify the balance is reduced by withdrawal + donation
    const expectedBalance = initialBalance - withdrawalAmount - donationAmount;
    
    // Get new balance - React should have updated the display automatically
    const newBalanceText = await balanceInput.inputValue();
    const newBalance = parseFloat(newBalanceText.replace(/,/g, ''));
    
    console.log(`Expected balance: $${expectedBalance.toFixed(2)}`);
    console.log(`Actual balance: $${newBalance.toFixed(2)}`);
    console.log(`Withdrawal: $${withdrawalAmount}, Donation: $${donationAmount}, Total deducted: $${withdrawalAmount + donationAmount}`);
    
    // Assert the balance is correct
    expect(newBalance).toBeCloseTo(expectedBalance, 2);
  });

  test('should show donation UI only on withdraw page', async ({ page }) => {
    // Check withdraw page has donation option
    await page.click('text=Withdraw');
    await expect(page.locator('#donation-toggle')).toBeVisible();
    await expect(page.locator('text=Donate $5 to Sweetums Charity')).toBeVisible();
    
    // Check deposit page does NOT have donation option
    await page.click('text=Deposit');
    await expect(page.locator('#donation-toggle')).not.toBeVisible();
  });

  test('should toggle donation checkbox correctly', async ({ page }) => {
    await page.click('text=Withdraw');
    
    // Verify checkbox starts unchecked
    const checkbox = page.locator('#donation-toggle');
    await expect(checkbox).not.toBeChecked();
    
    // Click the donation area to toggle
    await page.click('text=Donate $5 to Sweetums Charity');
    await expect(checkbox).toBeChecked();
    
    // Click again to toggle off
    await page.click('text=Donate $5 to Sweetums Charity');
    await expect(checkbox).not.toBeChecked();
  });

  test('should process withdrawal without donation when checkbox is unchecked', async ({ page }) => {
    await page.click('text=Withdraw');
    
    // Select an account
    await page.selectOption('select[name="account"]', { index: 1 });
    await page.waitForTimeout(500);
    
    // Get initial balance
    const balanceInput = page.locator('input[type="text"].right').first();
    const initialBalanceText = await balanceInput.inputValue();
    const initialBalance = parseFloat(initialBalanceText.replace(/,/g, ''));
    
    // Enter withdrawal amount (no donation)
    const withdrawalAmount = 25;
    await page.fill('input[name="amount"]', withdrawalAmount.toString());
    
    // Submit without enabling donation
    await page.click('button.btn');
    
    // Wait for success message
    await expect(page.locator('.success')).toBeVisible();
    
    // Wait for React state to update
    await page.waitForTimeout(1000);
    
    // Verify balance is reduced by only withdrawal amount
    const expectedBalance = initialBalance - withdrawalAmount;
    const newBalanceText = await balanceInput.inputValue();
    const newBalance = parseFloat(newBalanceText.replace(/,/g, ''));
    
    expect(newBalance).toBeCloseTo(expectedBalance, 2);
  });
});

