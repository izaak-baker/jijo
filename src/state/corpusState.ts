import { create } from "zustand";
import {
  collectTagOptions,
  ItemTag,
  notExcluded,
  TagOptions,
  toggleTag,
} from "../utils/tags.ts";

export type CorpusItem = {
  target: string[];
  romanization: string[];
  native: string[];
  tags: ItemTag[];
};

export type CorpusState = {
  corpus: CorpusItem[];
  tagOptions: TagOptions;
  filteredCorpus: CorpusItem[];
  excludedTagOptions: TagOptions;
  setCorpus(corpus: CorpusItem[]): void;
  toggleTag(tag: ItemTag): void;
  excludeAll(): void;
  includeAll(): void;
};

export const useCorpusStore = create<CorpusState>((set) => ({
  corpus: [],
  filteredCorpus: [],
  tagOptions: {},
  excludedTagOptions: {},
  setCorpus(corpus: CorpusItem[]) {
    const tagOptions = collectTagOptions(corpus);
    set((state) => ({
      ...state,
      corpus,
      filteredCorpus: corpus,
      tagOptions,
    }));
  },
  toggleTag(tag: ItemTag) {
    set((state) => {
      const excludedTagOptions = toggleTag(state.excludedTagOptions, tag);
      const filteredCorpus = state.corpus.filter(
        notExcluded(excludedTagOptions),
      );
      console.log(filteredCorpus.length);
      return { ...state, excludedTagOptions, filteredCorpus };
    });
  },
  excludeAll() {
    set((state) => ({
      ...state,
      filteredCorpus: [],
      excludedTagOptions: structuredClone(state.tagOptions),
    }));
  },
  includeAll() {
    set((state) => ({
      ...state,
      filteredCorpus: structuredClone(state.corpus),
      excludedTagOptions: {},
    }));
  },
}));
