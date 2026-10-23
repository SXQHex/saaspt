import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', fullyParallel: true,
  use: { baseURL: 'http://127.0.0.1:3002', browserName: 'chromium', screenshot: 'only-on-failure' },
  webServer: { command: 'pnpm --filter @saaspt/web start --port 3002', url: 'http://127.0.0.1:3002', reuseExistingServer: false },
});
