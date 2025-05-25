const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I am on the login page', async function() {
    async function attemptNavigation(world, attempt = 1) {
        try {
            await world.loginPage.goto();
            await Promise.all([
                world.page.waitForLoadState('networkidle', { timeout: world.navigationTimeout }),
                world.page.waitForLoadState('domcontentloaded'),
                world.page.waitForSelector('form', { state: 'visible', timeout: world.defaultTimeout })
            ]);
        } catch (error) {
            if (attempt < world.retryCount) {
                console.log(`Retrying navigation (attempt ${attempt + 1})`);
                await world.page.reload();
                return attemptNavigation(world, attempt + 1);
            }
            console.error('Failed to navigate to login page:', error);
            await world.takeScreenshot('login-page-failure');
            throw error;
        }
    }
    
    await attemptNavigation(this);
});

When('I navigate to the registration page', async function() {
    try {
        await this.loginPage.navigateToRegister();
        await this.page.waitForLoadState('networkidle');
    } catch (error) {
        console.error('Failed to navigate to registration page:', error);
        await this.takeScreenshot('registration-nav-failure');
        throw error;
    }
});

When('I register as a new user', async function() {
    try {
        const userData = await this.testDataManager.generateUserData(this.tags);
        console.log('Registering with email:', userData.email);
        await this.registerPage.registerUser(userData);
        this.testData.currentUser = userData;
    } catch (error) {
        console.error('Failed to register user:', error);
        await this.takeScreenshot('registration-failure');
        throw error;
    }
});

When('I register with the following details:', async function(dataTable) {
    try {
        const userData = dataTable.hashes()[0];
        // Replace {timestamp} placeholder with actual timestamp
        userData.email = userData.email.replace('{timestamp}', Date.now());
        console.log('Registering with email:', userData.email);
        
        await this.registerPage.registerUser(userData);
        this.testData.currentUser = userData;
    } catch (error) {
        console.error('Failed to register with data table:', error);
        await this.takeScreenshot('registration-datatable-failure');
        throw error;
    }
});

When('I login with the registered credentials', async function() {
    try {
        const user = this.testData.currentUser;
        if (!user) {
            throw new Error('No registered user found in test data');
        }
        console.log('Logging in with email:', user.email);
        await this.loginPage.validLogin(user.email, user.password);
        await this.page.waitForLoadState('networkidle');
    } catch (error) {
        console.error('Failed to login:', error);
        await this.takeScreenshot('login-failure');
        throw error;
    }
});

Then('I should be on the products page', async function() {
    try {
        await this.page.waitForLoadState('networkidle');
        const titles = await this.dashboardPage.getProductsList();
        expect(titles.length).toBeGreaterThan(0);
    } catch (error) {
        console.error('Failed to verify products page:', error);
        await this.takeScreenshot('products-page-failure');
        throw error;
    }
});

When('I add {string} to the cart', async function(productName) {
    try {
        await this.dashboardPage.addProductToCart(productName);
        console.log(`Added product to cart: ${productName}`);
    } catch (error) {
        console.error(`Failed to add product ${productName} to cart:`, error);
        await this.takeScreenshot('add-to-cart-failure');
        throw error;
    }
});

When('I navigate to the cart', async function() {
    try {
        await this.dashboardPage.navigateToCart();
        await this.page.waitForLoadState('networkidle');
    } catch (error) {
        console.error('Failed to navigate to cart:', error);
        await this.takeScreenshot('cart-nav-failure');
        throw error;
    }
});

Then('the product {string} should be in the cart', async function(productName) {
    try {
        await this.cartPage.verifyProductInCart(productName);
    } catch (error) {
        console.error(`Failed to verify product ${productName} in cart:`, error);
        await this.takeScreenshot('cart-verification-failure');
        throw error;
    }
});

When('I proceed to checkout', async function() {
    try {
        await this.cartPage.goToCheckout();
        await this.page.waitForLoadState('networkidle');
    } catch (error) {
        console.error('Failed to proceed to checkout:', error);
        await this.takeScreenshot('checkout-nav-failure');
        throw error;
    }
});

When('I enter shipping details for a random country', async function() {
    try {
        const shippingData = await this.testDataManager.generateShippingData();
        this.testData.currentShipping = shippingData;
        await this.checkoutPage.fillShippingInfo(shippingData.countryCode);
        console.log(`Using shipping address in ${shippingData.country}`);
    } catch (error) {
        console.error('Failed to enter shipping details:', error);
        await this.takeScreenshot('shipping-details-failure');
        throw error;
    }
});

When('I enter shipping information for {string}', async function(countryCode) {
    try {
        await this.checkoutPage.fillShippingInfo(countryCode);
        console.log(`Entered shipping information for country code: ${countryCode}`);
    } catch (error) {
        console.error('Failed to enter shipping information:', error);
        await this.takeScreenshot('shipping-info-failure');
        throw error;
    }
});

When('I place the order', async function() {
    try {
        await this.checkoutPage.placeOrder();
        await this.page.waitForLoadState('networkidle');
    } catch (error) {
        console.error('Failed to place order:', error);
        await this.takeScreenshot('place-order-failure');
        throw error;
    }
});

Then('I should see the order confirmation', async function() {
    try {
        const orderDetails = await this.checkoutPage.getOrderConfirmation();
        expect(orderDetails.message).toContain('Thankyou for the order');
        this.testData.orderId = orderDetails.id;
        console.log(`Order confirmed with ID: ${orderDetails.id}`);
    } catch (error) {
        console.error('Failed to verify order confirmation:', error);
        await this.takeScreenshot('order-confirmation-failure');
        throw error;
    }
});

Then('I should capture the order confirmation screenshot', async function() {
    try {
        const sanitizedId = this.testData.orderId.replace(/[^a-zA-Z0-9]/g, '');
        await this.page.waitForTimeout(1000); // Wait for animations
        await this.takeScreenshot(`order-${sanitizedId}-${Date.now()}`);
    } catch (error) {
        console.error('Failed to capture order confirmation screenshot:', error);
        throw error;
    }
});
