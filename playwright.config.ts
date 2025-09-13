import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright",
  outputDir: "./playwright-output",
  snapshotDir: "./playwright-snapshots",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { outputFolder: "playwright-report" }]],
  use: {
    // baseURL: 'http://localhost:3000',
    trace: "on-first-retry",
  },

  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
