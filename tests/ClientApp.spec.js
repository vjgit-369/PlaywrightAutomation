const { test, expect } = require("@playwright/test");

const TEST_DATA = {
    URL: "https://rahulshettyacademy.com/client/",
    EMAIL: "vijaysoftwareqa369@gmail.com",
    PASSWORD: "Health0!"
};

test.describe('Client Application Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(TEST_DATA.URL);
    });

    test('should successfully login and display products', async ({ page }) => {
        // Fill login credentials
        await page.locator('#userEmail').fill(TEST_DATA.EMAIL);
        await page.locator('#userPassword').fill(TEST_DATA.PASSWORD);
        
        // Click login and wait for navigation
        await page.locator('#login').click();
        await page.waitForNavigation({ waitUntil: 'networkidle' });
        
        // Verify successful login
        const pageTitle = await page.title();
        console.log(`Page title: ${pageTitle}`);
        expect(pageTitle).toContain('Dashboard');
        
        // Verify products are displayed
        const productsLocator = page.locator('.card-body b');
        await expect(productsLocator).toBeVisible();
        
        const titles = await productsLocator.allTextContents();
        console.log(`Products Listed: ${JSON.stringify(titles)}`);
        expect(titles.length).toBeGreaterThan(0);
    });
});