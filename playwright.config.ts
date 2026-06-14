import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { open: 'never' }]],
  globalSetup: './src/e2e/global-setup.ts',
  globalTeardown: './src/e2e/global-teardown.ts',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:4321',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  /* Custom snapshot path */
  snapshotDir: './src/e2e/snapshots',
  snapshotPathTemplate: '{snapshotDir}/{projectName}/{arg}{ext}',

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'tsx src/e2e/mock-api.ts',
      port: 3333,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev -- --mode test',
      url: 'http://localhost:4321',
      reuseExistingServer: !process.env.CI,
    },
  ],
});
