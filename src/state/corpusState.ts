import { create } from "zustand";
import {
  collectTagOptions,
  FilterType,
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
  filterType: FilterType;
  setFilterType(filterType: FilterType): void;
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
  filterType: "any",
  setCorpus(corpus: CorpusItem[]) {
    const tagOptions = collectTagOptions(corpus);
    set((state) => ({
      ...state,
      corpus,
      filteredCorpus: corpus,
      tagOptions,
    }));
  },
  setFilterType(filterType: FilterType) {
    set((state) => ({
      ...state,
      filterType,
      filteredCorpus: state.corpus.filter(
        notExcluded(state.excludedTagOptions, filterType),
      ),
    }));
  },
  toggleTag(tag: ItemTag) {
    set((state) => {
      const excludedTagOptions = toggleTag(state.excludedTagOptions, tag);
      const filteredCorpus = state.corpus.filter(
        notExcluded(excludedTagOptions, state.filterType),
      );
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
