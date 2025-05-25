class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.countryInput = page.locator('[placeholder="Select Country"]');
        this.countryOptions = page.locator('.ta-results button');
        this.placeOrderButton = page.locator('.action__submit');
        this.confirmationMessage = page.locator('.hero-primary');
        this.orderId = page.locator('.em-spacer-1 .ng-star-inserted');
    }    async fillShippingInfo(countryCode) {
        await this.countryInput.fill('');  // Clear existing value
        await this.countryInput.type(countryCode, { delay: 100 });
        await this.page.waitForTimeout(1000); // Wait for dropdown to appear
        await this.countryOptions.first().waitFor({ state: 'visible', timeout: 10000 });
        await this.countryOptions.first().click();
        // Wait for country selection to be applied
        await this.page.waitForLoadState('networkidle');
    }

    async placeOrder() {
        await this.placeOrderButton.click();
    }

    async getOrderConfirmation() {
        await this.confirmationMessage.waitFor({ state: 'visible' });
        const message = await this.confirmationMessage.textContent();
        const id = await this.orderId.textContent();
        return { message, id };
    }

    async takeOrderScreenshot(path) {
        await this.page.screenshot({ 
            path: path,
            fullPage: true 
        });
    }
}

module.exports = { CheckoutPage };
