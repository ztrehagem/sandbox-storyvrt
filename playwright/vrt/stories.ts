import { readFile } from "node:fs/promises";

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

async function readJSON<T>(buffer: Promise<Buffer>): Promise<T> {
  return JSON.parse((await buffer).toString());
}

const storybookIndex = await readJSON<StorybookIndex>(
  readFile("storybook-static/index.json"),
);

export const stories: readonly Story[] = Object.values(
  storybookIndex.entries,
).filter((story) => story.type == "story");
