const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

/**
 * Common navigation steps
 */
When('I wait for {int} seconds', async function(seconds) {
    await this.page.waitForTimeout(seconds * 1000);
});

When('I take a screenshot named {string}', async function(name) {
    await this.takeScreenshot(name);
});

Then('the page title should contain {string}', async function(expectedTitle) {
    const title = await this.page.title();
    expect(title).toContain(expectedTitle);
});

Then('I should see text {string}', async function(expectedText) {
    const bodyText = await this.page.textContent('body');
    expect(bodyText).toContain(expectedText);
});

/**
 * Common validation steps
 */
Then('I should see element {string}', async function(selector) {
    const element = this.page.locator(selector);
    await expect(element).toBeVisible();
});

Then('I should not see element {string}', async function(selector) {
    const element = this.page.locator(selector);
    await expect(element).toBeHidden();
});

/**
 * Common interaction steps
 */
When('I click on {string}', async function(selector) {
    await this.page.click(selector);
});

When('I fill in {string} with {string}', async function(selector, value) {
    await this.page.fill(selector, value);
});

When('I select {string} from {string}', async function(value, selector) {
    await this.page.selectOption(selector, value);
});
