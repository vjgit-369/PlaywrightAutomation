const { test: baseTest, expect } = require('@playwright/test');

// Extend base test with custom fixtures
const test = baseTest.extend({
    testDataPath: ['../../test-data', { option: true }],
    // Custom fixture for page object initialization
    pageObjects: async ({ page }, use) => {
        const pageObjects = {
            loginPage: new (require('../../pageobjects/LoginPage')).LoginPage(page),
            registerPage: new (require('../../pageobjects/RegisterPage')).RegisterPage(page),
            dashboardPage: new (require('../../pageobjects/DashboardPage')).DashboardPage(page),
            cartPage: new (require('../../pageobjects/CartPage')).CartPage(page),
            checkoutPage: new (require('../../pageobjects/CheckoutPage')).CheckoutPage(page)
        };
        await use(pageObjects);
    }
});

module.exports = { test, expect };
