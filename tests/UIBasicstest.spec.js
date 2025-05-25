const { test, expect } = require("@playwright/test");

const TEST_DATA = {
    URL: "https://rahulshettyacademy.com/loginpagePractise/",
    INVALID_CREDENTIALS: {
        username: "test",
        password: "learning"
    },
    VALID_CREDENTIALS: {
        username: "rahulshettyacademy",
        password: "learning"
    }
};

test.describe('UI Basics Tests', () => {
    test.beforeEach(async ({ browser }) => {
        // Create a new browser context
        const context = await browser.newContext();
        // Create a new page in that context
        const page = await context.newPage();
        
        // Store page and context in test state
        test.info().context = context;
        test.info().page = page;
    });

    test.afterEach(async ({ browser }) => {
        const context = test.info().context;
        if (context) {
            await context.close();
        }
    });

    test('should register a new user', async ({ browser }) => {
        const page = test.info().page;
        
        // Navigate to the client page
        await page.goto('https://rahulshettyacademy.com/client/');
        
        // Click on register link
        await page.locator('text=Don\'t have an account? Register here').click();
        
        // Fill registration form with data from Registrationdetails and username tables
        await page.locator('#firstName').fill('John');
        await page.locator('#lastName').fill('Doe');
        await page.locator('#email').fill('john.doe@example.com');
        await page.locator('#password').fill('Password123!');
        await page.locator('#confirmPassword').fill('Password123!');
        
        // Fill address details
        await page.locator('#address').fill('123 Test Street');
        await page.locator('#city').fill('Test City');
        await page.locator('#state').fill('Test State');
        await page.locator('#zipCode').fill('12345');
        
        // Select country
        await page.locator('#country').selectOption('United States');
        
        // Fill phone number
        await page.locator('#phone').fill('1234567890');
        
        // Click register button
        await page.locator('button[type="submit"]').click();
        
        // Wait for registration success
        await page.waitForNavigation();
        
        // Verify registration success
        const successMessage = await page.locator('.alert-success');
        expect(await successMessage.isVisible()).toBe(true);
    });

    test('should handle login with invalid credentials', async ({ browser }) => {
        const page = test.info().page;
        
        // Fill invalid credentials
        await page.locator('[name="username"]').fill(TEST_DATA.INVALID_CREDENTIALS.username);
        await page.locator('[type="password"]').fill(TEST_DATA.INVALID_CREDENTIALS.password);
        
        // Check terms checkbox
        await page.locator('#terms').check();
        
        // Click sign in and wait for error message
        await page.locator('#signInBtn').click();
        await page.waitForSelector('[style*="block"]');
        
        // Verify error message
        const errorMessage = await page.locator('[style*="block"]').textContent();
        console.log(`Error Message: ${errorMessage}`);
        expect(errorMessage).toContain('Incorrect');
    });

    test('should handle login with valid credentials and display cards', async ({ browser }) => {
        const page = test.info().page;
        
        // Fill valid credentials
        await page.locator('[name="username"]').fill(TEST_DATA.VALID_CREDENTIALS.username);
        await page.locator('[type="password"]').fill(TEST_DATA.VALID_CREDENTIALS.password);
        
        // Check terms checkbox
        await page.locator('#terms').check();
        
        // Click sign in and wait for navigation
        await page.locator('#signInBtn').click();
        await page.waitForNavigation({ waitUntil: 'networkidle' });
        
        // Verify cards are displayed
        const cardTitles = page.locator('.card-body a');
        const allCardTitles = await cardTitles.allTextContents();
        
        console.log(`Number of Cards: ${allCardTitles.length}`);
        console.log(`All Card Titles: ${JSON.stringify(allCardTitles)}`);
        
        // Verify at least one card is displayed
        expect(allCardTitles.length).toBeGreaterThan(0);
        
        // Verify first and last card titles
        const firstCard = await cardTitles.nth(0).textContent();
        const lastCard = await cardTitles.last().textContent();
        console.log(`First Card Title: ${firstCard}`);
        console.log(`Last Card Title: ${lastCard}`);
        expect(firstCard).toBeTruthy();
        expect(lastCard).toBeTruthy();
    });
});

test('UI Controls Test', async ({page})=>
    {
    
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        console.log(await page.title());

        const dropdown1 = page.locator('select.form-control');
        const blinkLink = page.locator('[href*=documents-request]');
        await dropdown1.selectOption('consult');
        await page.locator('.radiotextsty').last().click();
        await page.locator('#okayBtn').click();
        await expect(page.locator('.radiotextsty').last()).toBeChecked();
        console.log(await page.locator('.radiotextsty').last().isChecked());
        await page.locator('#terms').click();
        await expect(page.locator('#terms')).toBeChecked();
        console.log(await page.locator('#terms').isChecked());
        await page.locator('#terms').uncheck();
        console.log(await page.locator('#terms').isChecked());
        await expect(blinkLink).toHaveAttribute('class', 'blinkingText');












    });

    test('Child Window Handling', async ({browser})=>
        {
            const context = await browser.newContext();
            const page = await context.newPage();
            await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
            console.log(await page.title());
            const blinkLink = page.locator('[href*=documents-request]');
            
            const [newPage] = await Promise.all([
             context.waitForEvent('page'), 
             blinkLink.click(),  
            ])

            const text = await newPage.locator('.red').textContent();
            console.log(`Display Text: ${text}`);



            

    
    
    
    
    
    });