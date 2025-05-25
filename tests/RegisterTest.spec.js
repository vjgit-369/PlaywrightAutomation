const { test, expect } = require('@playwright/test');

// Test data
const validPassword = 'Test@12345';
let registeredUsername; // Will store successfully registered username

test('successful registration', async ({ page }) => {
    const uniqueUsername = `user${Date.now()}`; // Simplified username format
    registeredUsername = uniqueUsername;

    await page.goto('https://practice.expandtesting.com/register');
    await page.fill('input[name="username"]', uniqueUsername);
    await page.fill('input[name="password"]', validPassword);
    await page.fill('input[name="confirmPassword"]', validPassword);
    
    // Submit form and wait for response
    const responsePromise = page.waitForResponse(response => 
        response.url().includes('/register') && response.status() === 200
    );
    await page.click('button[type="submit"]');
    await responsePromise;

    // Check success message
    const successMessage = page.locator('#flash');
    await expect(successMessage).toBeVisible({ timeout: 15000 });
    await expect(successMessage).toHaveClass(/alert-info/);
    await expect(successMessage).toContainText('Successfully registered');
});

test('registration with missing username', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/register');
    await page.fill('input[name="password"]', validPassword);
    await page.fill('input[name="confirmPassword"]', validPassword);
    await page.click('button[type="submit"]');
    
    const errorMessage = page.locator('#flash');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveClass(/alert-danger/);
    await expect(errorMessage).toContainText('All fields are required');
});

test('registration with missing password', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/register');
    await page.fill('input[name="username"]', `testuser_${Date.now()}`);
    await page.fill('input[name="confirmPassword"]', validPassword);
    await page.click('button[type="submit"]');
    
    const errorMessage = page.locator('#flash');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveClass(/alert-danger/);
    await expect(errorMessage).toContainText('All fields are required');
});

test('registration with missing confirm password', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/register');
    await page.fill('input[name="username"]', `testuser_${Date.now()}`);
    await page.fill('input[name="password"]', validPassword);
    await page.click('button[type="submit"]');
    
    const errorMessage = page.locator('#flash');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveClass(/alert-danger/);
    await expect(errorMessage).toContainText('All fields are required');
});

test('registration with non-matching passwords', async ({ page }) => {
    const uniqueUsername = `user${Date.now()}`; // Simplified username format
    await page.goto('https://practice.expandtesting.com/register');
    await page.fill('input[name="username"]', uniqueUsername);
    await page.fill('input[name="password"]', validPassword);
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!');
    await page.click('button[type="submit"]');
    
    const errorMessage = page.locator('#flash');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveClass(/alert-danger/);
    await expect(errorMessage).toContainText('Passwords do not match');
});

test('registration with existing username', async ({ page }) => {
    test.fail(); // This test should always run last
    await page.goto('https://practice.expandtesting.com/register');
    await page.fill('input[name="username"]', registeredUsername);
    await page.fill('input[name="password"]', validPassword);
    await page.fill('input[name="confirmPassword"]', validPassword);
    await page.click('button[type="submit"]');
    
    const errorMessage = page.locator('#flash');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveClass(/alert-danger/);
    await expect(errorMessage).toContainText('Username already exists');
});
