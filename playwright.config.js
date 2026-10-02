const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests', workers: 1, retries: 0, timeout: 30000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'https://www.saucedemo.com', browserName: 'chromium', screenshot: 'only-on-failure', trace: 'retain-on-failure' }
});
