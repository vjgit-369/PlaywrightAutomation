class LoginPage {
    constructor(page) {
        this.page = page;
        this.userEmail = page.locator('#userEmail');
        this.userPassword = page.locator('#userPassword');
        this.loginButton = page.locator('#login');
        this.registerLink = page.locator('a[href="/client/auth/register"]');
    }    async goto() {
        await this.page.goto('https://rahulshettyacademy.com/client/', {
            timeout: 30000,
            waitUntil: 'networkidle'
        });
    }async validLogin(email, password) {
        await this.userEmail.fill(email);
        await this.userPassword.fill(password);
        
        // Click and wait for response in parallel
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
            this.loginButton.click()
        ]);
    }

    async navigateToRegister() {
        await this.registerLink.click();
    }
}

module.exports = { LoginPage };
