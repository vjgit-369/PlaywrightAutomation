const { test, expect } = require('../base/test.base');
const testData = require('../../test-data/e2e-test-data.json');

test.describe('E2E Shopping Tests', () => {
    test('Complete shopping flow with new user @e2e @smoke', async ({ page, pageObjects }) => {
        const { loginPage, registerPage, dashboardPage, cartPage, checkoutPage } = pageObjects;
        const userData = testData.testUsers.defaultUser;
        const targetProduct = testData.products[0];

        try {
            await test.step('User Registration', async () => {
                await loginPage.goto();
                await loginPage.navigateToRegister();
                await registerPage.registerUser(userData);
                await page.waitForLoadState('networkidle');
                // Verify registration success
                await expect(page.locator('text=Login')).toBeVisible({ timeout: 10000 });
            });            await test.step('User Login', async () => {
                await loginPage.goto();
                await loginPage.validLogin(userData.email, userData.password);
                // Verify successful login by checking dashboard elements
                await page.waitForLoadState('networkidle');
                // Check for product catalog and cart button to confirm login
                await expect(page.locator('.card-body').first()).toBeVisible({ timeout: 15000 });
                await expect(page.locator('button[routerlink="/dashboard/cart"]')).toBeVisible({ timeout: 5000 });
            });

            await test.step('Product Selection', async () => {
                const titles = await dashboardPage.getProductsList();
                test.info().annotations.push({
                    type: 'Products Found',
                    description: `${titles.length} products available`
                });
                await dashboardPage.addProductToCart(targetProduct.name);
                await dashboardPage.navigateToCart();
            });

            await test.step('Cart and Checkout', async () => {
                await cartPage.verifyProductInCart(targetProduct.name);
                await cartPage.goToCheckout();
            });

            await test.step('Order Completion', async () => {
                await checkoutPage.fillShippingInfo('ind');
                await checkoutPage.placeOrder();
                
                const orderDetails = await checkoutPage.getOrderConfirmation();
                expect(orderDetails.message).toContain('Thankyou for the order');
                
                await page.waitForLoadState('networkidle');
                const screenshotPath = `./test-results/order-${Date.now()}.png`;
                await page.screenshot({ path: screenshotPath, fullPage: true });
                
                test.info().annotations.push({
                    type: 'Order ID',
                    description: orderDetails.id
                });
            });

        } catch (error) {
            console.error('Test failed:', error.message);
            const screenshotPath = `./test-results/failure-${Date.now()}.png`;
            await page.screenshot({ path: screenshotPath, fullPage: true });
            test.info().annotations.push({
                type: 'Error',
                description: `${error.message}\nScreenshot: ${screenshotPath}`
            });
            throw error;
        }
    });

    test.afterEach(async ({ page }) => {
        try {
            await page.goto('https://rahulshettyacademy.com/client/auth/login');
            await page.waitForLoadState('networkidle');
        } catch (error) {
            console.warn('Cleanup warning:', error.message);
        }
    });
});
