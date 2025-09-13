import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"

export default mergeConfig(viteConfig, defineConfig({
  test: {
    projects: [{
      extends: true,
      plugins: [
        storybookTest({
          configDir: '.storybook'
        })
      ],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  }
}))
