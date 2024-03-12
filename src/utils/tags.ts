import { CorpusItem } from "../state/corpusState.ts";

export const STRING_TAG_KEY = "_";
export type TagOptions = { [key: string]: Set<string> };
export type ItemTag =
  | {
      key: string;
      value: string;
    }
  | string;

export function collectTagOptions(corpus: CorpusItem[]): TagOptions {
  const tagOptions: TagOptions = {};
  for (const item of corpus) {
    for (const tag of item.tags) {
      if (!Object.hasOwn(tagOptions, tagKey(tag))) {
        tagOptions[tagKey(tag)] = new Set();
      }
      tagOptions[tagKey(tag)].add(tagValue(tag));
    }
  }
  return tagOptions;
}

export function toggleTag(options: TagOptions, tag: ItemTag): TagOptions {
  const newTagOptions: TagOptions = structuredClone(options);
  const key = tagKey(tag);
  const value = tagValue(tag);
  if (!Object.hasOwn(newTagOptions, key)) {
    newTagOptions[key] = new Set();
    newTagOptions[key].add(value);
  } else {
    if (newTagOptions[key].has(value)) {
      newTagOptions[key].delete(value);
    } else {
      newTagOptions[key].add(value);
    }
  }
  return newTagOptions;
}

export function tagKey(tag: ItemTag): string {
  return typeof tag === "string" ? STRING_TAG_KEY : tag.key;
}

export function tagValue(tag: ItemTag): string {
  return typeof tag === "string" ? tag : tag.value;
}

export function tag(value: string, key?: string): ItemTag {
  if (key) return { key, value };
  return value;
}
