const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60 * 1000, // Increased timeout for slower execution
  expect: {
    timeout: 10000
  },
  // Run all tests in headed mode by default
  use: {
    headless: false,
    baseURL: 'http://localhost:3000',
    // Use Chrome for better demo visibility
    channel: 'chrome',
    // Make the window a reasonable size
    viewport: { width: 1280, height: 720 },
    // Add a longer delay between actions for demo purposes
    actionTimeout: 15000,
    // Slow down each action significantly for visibility
    launchOptions: {
      slowMo: 1500,
    },
    // Enable trace for visual debugging
    trace: 'on',
    // Add visual colored borders around operated elements
    colorScheme: 'dark',
    // Record video for demo purposes
    video: 'on-first-retry',
  },
  // Show the browser window in the center of the screen
  launchOptions: {
    args: ['--window-position=center'],
  }
});
