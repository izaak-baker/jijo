import { create } from "zustand";
import { collectTagOptions, ItemTag, TagOptions } from "../utils/tags.ts";

export type CorpusItem = {
  target: string[];
  romanization: string[];
  native: string[];
  tags: ItemTag[];
};

export type CorpusState = {
  corpus: CorpusItem[];
  tagOptions: TagOptions;
  setCorpus(corpus: CorpusItem[]): void;
};

export const useCorpusStore = create<CorpusState>((set) => ({
  corpus: [],
  tagOptions: {},
  setCorpus(corpus: CorpusItem[]) {
    const tagOptions = collectTagOptions(corpus);
    set((state) => ({
      ...state,
      corpus,
      tagOptions,
    }));
  },
}));
