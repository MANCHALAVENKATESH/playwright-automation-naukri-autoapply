// playwright.config.js
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  testDir: './tests',                // your test folder
  timeout: 60 * 1000,                // 60 seconds per test
  expect: { timeout: 5000 },

  // Browser configuration
  use: {
    headless: true,                 // set true for CI
    browserName: 'chromium',         // chromium, firefox, or webkit
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true, // ignore HTTPS errors in CI
    locale: 'en-US', // set locale
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    slowMo: 50
  },

  // Parallel execution config
  workers: 2,                        // run 2 tests at a time
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
});
