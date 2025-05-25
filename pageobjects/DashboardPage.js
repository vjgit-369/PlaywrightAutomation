class DashboardPage {
    constructor(page) {
        this.page = page;
        this.productsTitle = page.locator('.card-body b');
        this.cartButton = page.locator('[routerlink*="cart"]');
        this.addToCartButtons = page.locator('.card-body button:has-text("Add To Cart")');
        this.toastMessage = page.locator('[aria-label="Product Added To Cart"]');
    }

    async getProductsList() {
        await this.page.waitForLoadState('networkidle');
        return this.productsTitle.allTextContents();
    }    async addProductToCart(productName) {
        const titles = await this.getProductsList();
        const productIndex = titles.findIndex(title => title.trim() === productName.trim());
        if (productIndex === -1) {
            console.log('Available products:', titles);
            throw new Error(`Product "${productName}" not found in the product list`);
        }
        
        try {
            await this.addToCartButtons.nth(productIndex).click();
            await this.toastMessage.waitFor({ state: 'visible', timeout: 5000 });
        } catch (error) {
            throw new Error(`Failed to add "${productName}" to cart: ${error.message}`);
        }
    }

    async navigateToCart() {
        await this.cartButton.click();
    }
}

module.exports = { DashboardPage };
