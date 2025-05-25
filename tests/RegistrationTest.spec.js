const { test, expect } = require("@playwright/test");

test.describe('Registration Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/client/');
    });

    test('should register a new user with valid details', async ({ page }) => {
        // Click on register link
        await page.locator('a[href="/client/auth/register"]').click();
        
        // Fill registration form
        await page.locator('input[placeholder="First Name"]').fill('John');
        await page.locator('input[placeholder="Last Name"]').fill('Doe');
        await page.locator('input[placeholder="email@example.com"]').fill('john.doe+test@example.com');
        await page.locator('input[placeholder="enter your number"]').fill('1234567890');
        
        // Select occupation
        await page.locator('select').selectOption('Student');
        
        // Fill password fields
        await page.locator('input[placeholder="Passsword"]').fill('Password123!');
        await page.locator('div > #confirmPassword').fill('Password123!');
        
        // Check age checkbox
        await page.waitForSelector('input[type="checkbox"]');
        await page.locator('input[type="checkbox"]').check();
        
        // Click register button
        await page.locator('form > #login').click();
        await page.locator('div > div > p').click(); 
        
    }),

    test('should successfully login and display products', async ({ page }) => {
        const TEST_DATA = {
            EMAIL: "vijaysoftwareqa369@gmail.com",
            PASSWORD: "Health0!"
        };

        // Fill login credentials
        await page.locator('#userEmail').fill(TEST_DATA.EMAIL);
        await page.locator('#userPassword').fill(TEST_DATA.PASSWORD);
        
        // Click login and wait for navigation
        await page.locator('#login').click();
        await page.waitForNavigation({ waitUntil: 'networkidle' });
        
        // Verify successful login
        const pageTitle = await page.title();
        console.log('Page title: ' + pageTitle);
        expect(pageTitle).toContain("Let's Shop");
        
        // Verify products are displayed
        // Verify all products are displayed
        const productsLocator = page.locator('.card-body b');
        const count = await productsLocator.count();
        console.log(`Found ${count} products`);

        for (let i = 0; i < count; i++) {
            await expect(productsLocator.nth(i)).toBeVisible();
}

    const titles = await productsLocator.allTextContents();
console.log(`Products Listed: ${JSON.stringify(titles)}`);
    });
});