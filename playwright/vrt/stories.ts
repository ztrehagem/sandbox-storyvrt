import { readFile } from "node:fs/promises";
import { execSync } from "node:child_process";

interface StorybookIndex {
  readonly entries: readonly Story[];
}

export interface Story {
  readonly type: string;
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly importPath: string;
  readonly componentPath: string;
  readonly tags: readonly string[];
}

interface PreviewStats {
  readonly modules: readonly PreviewStatsModule[];
}

interface PreviewStatsModule {
  readonly id: string;
  readonly name: string;
  readonly reasons: readonly {
    readonly moduleName: string;
  }[];
}

function walk(set: Set<string>, stats: PreviewStats, id: string): void {
  if (set.has(id)) {
    return;
  }

  const module = stats.modules.find((module) => module.id == id);

  if (module == null) {
    return;
  }

  set.add(id);

  for (const reason of module.reasons) {
    walk(set, stats, reason.moduleName);
  }
}

async function readJSON<T>(buffer: Promise<Buffer>): Promise<T> {
  return JSON.parse((await buffer).toString());
}

export async function getAffectedStories(): Promise<Story[]> {
  const storybookIndex = await readJSON<StorybookIndex>(
    readFile("storybook-static/index.json"),
  );

  const stories = Object.values(storybookIndex.entries).filter(
    (story) => story.type == "story",
  );

  if (process.env.VRT_ALL != null) {
    return stories;
  }

  const diff = execSync(`git diff --name-only origin/main...HEAD`)
    .toString()
    .trim()
    .split("\n");

  if (
    [
      /^pnpm-lock\.yaml$/,
      /^\.storybook\/(main|preview).tsx?$/,
      /^playwright\.config\.ts$/,
    ].some((pattern) => diff.some((filepath) => pattern.test(filepath)))
  ) {
    return stories;
  }

  const stats = await readJSON<PreviewStats>(
    readFile("./storybook-static/preview-stats.json"),
  );

  const set = new Set<string>();

  const srcDiffIds = diff
    .filter((filepath) => filepath.startsWith("src/"))
    .map((filepath) => "./" + filepath);

  for (const id of srcDiffIds) {
    walk(set, stats, id);
  }

  const affectedStoryFiles = [...set.values()].filter((id) =>
    /\.stories\.tsx?/.test(id),
  );

  const affectedStories = stories.filter((story) =>
    affectedStoryFiles.includes(story.importPath),
  );

  return affectedStories;
}
