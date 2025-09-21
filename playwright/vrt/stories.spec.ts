import { test, expect } from "@playwright/test";
import { getAffectedStories } from "./stories";

const affectedStories = await getAffectedStories();

const cases = [
  {
    name: "mobile",
    viewport: {
      width: 360,
      height: 800,
    },
    stories: affectedStories,
  },
  {
    name: "tablet",
    viewport: {
      width: 768,
      height: 1024,
    },
    stories: affectedStories,
  },
  {
    name: "laptop",
    viewport: {
      width: 1366,
      height: 768,
    },
    stories: affectedStories,
  },
  {
    name: "desktop",
    viewport: {
      width: 1920,
      height: 1080,
    },
    stories: affectedStories,
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
