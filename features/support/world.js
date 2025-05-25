const { setWorldConstructor } = require('@cucumber/cucumber');
const { LoginPage } = require('../../pageobjects/LoginPage');
const { RegisterPage } = require('../../pageobjects/RegisterPage');
const { DashboardPage } = require('../../pageobjects/DashboardPage');
const { CartPage } = require('../../pageobjects/CartPage');
const { CheckoutPage } = require('../../pageobjects/CheckoutPage');
const TestDataManager = require('./test-data-manager');
const { config } = require('./config');
const fs = require('fs').promises;

class CustomWorld {
    constructor({ parameters, tags }) {
        this.context = null;
        this.page = null;
        this.tags = tags || [];
        this.testDataManager = TestDataManager;
        this.config = config;
        this.parameters = parameters || {};
        this.defaultTimeout = parameters?.defaultTimeout || 30000;
        this.navigationTimeout = parameters?.navigationTimeout || 45000;
        this.retryCount = parameters?.retries || 2;
        this.testData = {
            currentUser: null,
            orderId: null,
            timestamp: Date.now(),
            screenshotsPath: './test-results/cucumber'
        };
    }    async takeScreenshot(name) {
        if (!this.page) return;
        
        try {
            await fs.mkdir(this.testData.screenshotsPath, { recursive: true });
            const timestamp = Date.now();
            const screenshotPath = `${this.testData.screenshotsPath}/${name}-${timestamp}.png`;
            await this.page.screenshot({
                path: screenshotPath,
                fullPage: true
            });
            console.log(`Screenshot saved: ${screenshotPath}`);
            return screenshotPath;
        } catch (error) {
            console.error('Failed to take screenshot:', error);
        }
    }async initializePages() {
        if (!this.page) {
            throw new Error('Page is not initialized');
        }
        
        try {
            this.loginPage = new LoginPage(this.page);
            this.registerPage = new RegisterPage(this.page);
            this.dashboardPage = new DashboardPage(this.page);
            this.cartPage = new CartPage(this.page);
            this.checkoutPage = new CheckoutPage(this.page);
        } catch (error) {
            console.error('Failed to initialize page objects:', error);
            throw error;
        }
    }
}

setWorldConstructor(CustomWorld);
