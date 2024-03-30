import { create } from "zustand";
import {
  collectTagOptions,
  FilterType,
  ItemTag,
  itemIsIncluded,
  TagOptions,
  toggleTag,
} from "../logic/tags.ts";

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
  activeTagOptions: TagOptions;
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
  activeTagOptions: {},
  filterType: "any",
  setCorpus(corpus: CorpusItem[]) {
    const tagOptions = collectTagOptions(corpus);
    set((state) => ({
      ...state,
      corpus,
      filteredCorpus: corpus,
      tagOptions,
      activeTagOptions: structuredClone(tagOptions),
    }));
  },
  setFilterType(filterType: FilterType) {
    set((state) => ({
      ...state,
      filterType,
      filteredCorpus: state.corpus.filter(
        itemIsIncluded(state.activeTagOptions, filterType),
      ),
    }));
  },
  toggleTag(tag: ItemTag) {
    set((state) => {
      const activeTagOptions = toggleTag(state.activeTagOptions, tag);
      const filteredCorpus = state.corpus.filter(
        itemIsIncluded(activeTagOptions, state.filterType),
      );
      return { ...state, activeTagOptions: activeTagOptions, filteredCorpus };
    });
  },
  excludeAll() {
    set((state) => ({
      ...state,
      filteredCorpus: [],
      activeTagOptions: {},
    }));
  },
  includeAll() {
    set((state) => ({
      ...state,
      filteredCorpus: structuredClone(state.corpus),
      activeTagOptions: structuredClone(state.tagOptions),
    }));
  },
}));
