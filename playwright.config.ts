import { defineConfig } from "@playwright/test";

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
    baseURL: "http://localhost:6006",
    trace: "on-first-retry",
  },

  webServer: {
    command: "pnpm exec http-server --port 6006 storybook-static",
    url: "http://localhost:6006",
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    {
      name: "vrt:chromium",
      use: {
        browserName: "chromium",
      },
    },
  ],
});
