import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  use: {
    baseURL: 'http://127.0.0.1:4173/examples/',
    browserName: 'chromium',
    headless: true
  },
  webServer: {
    command: 'npx http-server . -p 4173 -c-1 --silent',
    url: 'http://127.0.0.1:4173/examples/index.html',
    reuseExistingServer: false,
    timeout: 120000
  }
});
