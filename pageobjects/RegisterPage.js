class RegisterPage {
    constructor(page) {
        this.page = page;
        this.firstName = page.locator('input[placeholder="First Name"]');
        this.lastName = page.locator('input[placeholder="Last Name"]');
        this.email = page.locator('input[placeholder="email@example.com"]');
        this.phone = page.locator('input[placeholder="enter your number"]');
        this.occupation = page.locator('select');
        this.password = page.locator('input[placeholder="Passsword"]');
        this.confirmPassword = page.locator('div > #confirmPassword');
        this.checkbox = page.locator('input[type="checkbox"]');
        this.registerButton = page.locator('form > #login');
        this.successMessage = page.locator('div > div > p');
    }    async registerUser(userData) {
        // Fill in registration form with waits between fields
        await this.firstName.fill(userData.firstName);
        await this.page.waitForTimeout(100);
        
        await this.lastName.fill(userData.lastName);
        await this.page.waitForTimeout(100);
        
        await this.email.fill(userData.email);
        await this.page.waitForTimeout(100);
        
        await this.phone.fill(userData.phone);
        await this.page.waitForTimeout(100);
        
        await this.occupation.selectOption(userData.occupation);
        await this.page.waitForTimeout(100);
        await this.password.fill(userData.password);
        await this.confirmPassword.fill(userData.confirmPassword);
        await this.checkbox.check();
        await this.registerButton.click();
        await this.successMessage.waitFor({ state: 'visible' });
    }
}

module.exports = { RegisterPage };
