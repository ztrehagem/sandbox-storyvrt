import test, { expect } from "@playwright/test";
import { stories } from "./stories";

const cases = [
  {
    name: "mobile",
    viewport: {
      width: 360,
      height: 800,
    },
    stories,
  },
  {
    name: "tablet",
    viewport: {
      width: 768,
      height: 1024,
    },
    stories,
  },
  {
    name: "laptop",
    viewport: {
      width: 1366,
      height: 768,
    },
    stories,
  },
  {
    name: "desktop",
    viewport: {
      width: 1920,
      height: 1080,
    },
    stories,
  },
];

for (const { name, stories, viewport } of cases) {
  test.describe(name, () => {
    test.use({ viewport });

    for (const story of stories) {
      test(story.id, async ({ page }) => {
        await page.goto(`/iframe.html?id=${story.id}`);
        await page.waitForLoadState("networkidle");

        await expect(page).toHaveScreenshot();
      });
    }
  });
}
