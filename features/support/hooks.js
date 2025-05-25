const { Before, After, BeforeAll, AfterAll, Status } = require('@cucumber/cucumber');
const playwright = require('@playwright/test');
const fs = require('fs').promises;
const path = require('path');
const { config } = require('./config');
const testDataManager = require('./test-data-manager');

// Create necessary directories
BeforeAll(async () => {
    try {
        // Launch browser with extended timeout
        global.browser = await playwright.chromium.launch({ 
            headless: false,
            args: ['--start-maximized'],
            timeout: 60000,
            slowMo: 50
        });
        
        // Ensure directories exist
        const dirs = ['./test-results/cucumber', './test-data'];
        await Promise.all(dirs.map(dir => 
            fs.mkdir(dir, { recursive: true })
        ));
    } catch (error) {
        console.error('Failed to setup test environment:', error);
        throw error;
    }
});

// Close browser after all tests
After(async function (scenario) {
    try {
        if (scenario.result.status === Status.FAILED) {
            await this.takeScreenshot(`failure-${scenario.pickle.name}`);
        }
        
        // Ensure page and context are properly closed
        if (this.page) {
            await this.page.close().catch(console.error);
            this.page = null;
        }
        if (this.context) {
            await this.context.close().catch(console.error);
            this.context = null;
        }
    } catch (error) {
        console.error('Error in After hook:', error);
    }
});

AfterAll(async () => {
    try {
        if (global.browser) {
            await global.browser.close().catch(console.error);
            global.browser = null;
        }
    } catch (error) {
        console.error('Error closing browser:', error);
    }
});

// Create new context and page for each scenario
Before(async function () {
    try {
        this.context = await global.browser.newContext({
            viewport: { width: 1920, height: 1080 },
            acceptDownloads: true,
            navigationTimeout: this.navigationTimeout,
            actionTimeout: this.defaultTimeout
        });
        
        // Configure retry-ability for all operations
        this.context.setDefaultTimeout(this.defaultTimeout);
        
        this.page = await this.context.newPage();
        await this.page.setViewportSize({ width: 1920, height: 1080 });
        
        // Add error handling for console errors
        this.page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error('Page Error:', msg.text());
            }
        });
        
        // Add network error handling
        this.page.on('pageerror', error => {
            console.error('Page Error:', error.message);
        });
        
        await this.initializePages();
    } catch (error) {
        console.error('Failed to create browser context:', error);
        await this.takeScreenshot('browser-context-failure');
        throw error;
    }
});

// Close context after each scenario
After(async function (scenario) {
    try {
        // Capture screenshot on failure
        if (scenario.result.status === Status.FAILED) {
            const timestamp = Date.now();
            try {
                const screenshotPath = `./test-results/cucumber/failure-${timestamp}.png`;
                await this.page.screenshot({
                    path: screenshotPath,
                    fullPage: true
                });
                console.log(`Failure screenshot saved to: ${screenshotPath}`);
            } catch (err) {
                console.error('Failed to take failure screenshot:', err);
            }
        }
    } catch (error) {
        console.error('Error in after hook:', error);
    } finally {
        // Always try to close the context
        if (this.context) {
            try {
                await this.context.close();
            } catch (error) {
                console.error('Failed to close browser context:', error);
            }
        }
    }
});
