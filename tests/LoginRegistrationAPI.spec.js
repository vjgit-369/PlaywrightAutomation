const { test, expect } = require('@playwright/test');

test('Register new user and verify login API', async ({ page }) => {
    // Registration data
    const userData = {
        firstName: "John",
        lastName: "Doe",
        email: `john.doe${Date.now()}@test.com`,
        phone: "1234567890",
        occupation: "Student",
        password: "Test@123",
        confirmPassword: "Test@123"
    };

    // Navigate to registration page
    await page.goto('https://rahulshettyacademy.com/client/');
    await page.locator('a[href="/client/auth/register"]').click();
    
    // Fill registration form
    await page.locator('input[placeholder="First Name"]').fill(userData.firstName);
    await page.locator('input[placeholder="Last Name"]').fill(userData.lastName);
    await page.locator('input[placeholder="email@example.com"]').fill(userData.email);
    await page.locator('input[placeholder="enter your number"]').fill(userData.phone);
    
    // Select occupation
    await page.locator('select').selectOption(userData.occupation);
    
    // Fill password fields
    await page.locator('input[placeholder="Passsword"]').fill(userData.password);
    await page.locator('div > #confirmPassword').fill(userData.confirmPassword);
    
    // Check age checkbox
    await page.locator('input[type="checkbox"]').check();
      // Submit registration
    await page.locator('form > #login').click();
    
    // Wait for registration success
    await expect(page.locator('div > div > p')).toBeVisible();
    
    // Now let's test the login by navigating back to login page
    await page.goto('https://rahulshettyacademy.com/client/');
    await page.locator('#userEmail').fill(userData.email);
    await page.locator('#userPassword').fill(userData.password);
    
    // Click login and wait for navigation
    await page.locator('#login').click();
    await page.waitForNavigation({ waitUntil: 'networkidle' });
    
    // Verify successful login
    const pageTitle = await page.title();
    console.log('Page title: ' + pageTitle);
    expect(pageTitle).toContain("Let's Shop");
      // Verify products are displayed
    const productsLocator = page.locator('.card-body b');
    const count = await productsLocator.count();
    console.log(`Found ${count} products`);
    expect(count).toBeGreaterThan(0);

    // Find and add ADIDAS ORIGINAL to cart
    const titles = await productsLocator.allTextContents();
    const adidasIndex = titles.findIndex(title => title === 'ADIDAS ORIGINAL');
    expect(adidasIndex).toBeGreaterThanOrEqual(0); // Verify product exists

    // Add to cart
    const addToCartButtons = page.locator('.card-body button:has-text("Add To Cart")');
    await addToCartButtons.nth(adidasIndex).click();

    // Wait for toast message
    await page.waitForSelector('[aria-label="Product Added To Cart"]');

    // Go to cart
    await page.locator('[routerlink*="cart"]').click();

    // Verify item in cart
    const cartProducts = page.locator('div.cartSection h3');
    await expect(cartProducts).toContainText('ADIDAS ORIGINAL');

    // Checkout
    await page.locator('text=Checkout').click();

    // Fill shipping info
    await page.locator('[placeholder="Select Country"]').type('ind', { delay: 100 });
    await page.locator('.ta-results button').first().click();
    
    // Place order
    await page.locator('.action__submit').click();

    // Verify order confirmation
    const confirmMessage = page.locator('.hero-primary');
    await expect(confirmMessage).toContainText('Thankyou for the order.');
      // Get order ID
    const orderId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
    console.log('Order placed successfully. Order ID:', orderId);

    // Take screenshot of order confirmation
    await page.screenshot({ 
        path: './test-results/order-confirmation.png',
        fullPage: true 
    });
});
