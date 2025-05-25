const { expect } = require('@playwright/test');

class CartPage {
    constructor(page) {
        this.page = page;
        this.cartProducts = page.locator('div.cartSection h3');
        this.checkoutButton = page.locator('text=Checkout');
    }

    async verifyProductInCart(productName) {
        await expect(this.cartProducts).toContainText(productName);
    }

    async goToCheckout() {
        await this.checkoutButton.click();
    }
}

module.exports = { CartPage };
