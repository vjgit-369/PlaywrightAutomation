// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: {
    timeout: 15 * 1000
  },
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use */
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['github', { comments: 'always' }]
  ],

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
      },
    },
  ],

  /* Common test settings */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: 'https://rahulshettyacademy.com/client',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Configure navigation timeout */
    navigationTimeout: 30 * 1000,

    /* Configure actionTimeout */
    actionTimeout: 15 * 1000,

    /* Configure screenshot options */
    screenshot: 'only-on-failure',

    /* Default viewport size */
    viewport: { width: 1280, height: 720 },
  },
});

