const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pageobjects/LoginPage');
const { RegisterPage } = require('../../pageobjects/RegisterPage');
const { DashboardPage } = require('../../pageobjects/DashboardPage');
const { CartPage } = require('../../pageobjects/CartPage');
const { CheckoutPage } = require('../../pageobjects/CheckoutPage');
const testData = require('../../test-data/e2e-test-data.json');

test.describe('E2E Shopping Tests', () => {
    let loginPage;
    let registerPage;
    let dashboardPage;
    let cartPage;
    let checkoutPage;

    test.beforeEach(async ({ page }) => {
        // Initialize page objects
        loginPage = new LoginPage(page);
        registerPage = new RegisterPage(page);
        dashboardPage = new DashboardPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
    });    
    test('Complete shopping flow with new user', async ({ page }) => {
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
                console.log(`Available products: ${titles.length}`);
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
                console.log(`Order placed successfully. ID: ${orderDetails.id}`);
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
