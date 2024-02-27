import { create } from "zustand";

export type ItemTag =
  | {
      key: string;
      value: string;
    }
  | string;

export type CorpusItem = {
  target: string[];
  romanization: string[];
  native: string[];
  tags: ItemTag[];
};

export type CorpusState = {
  corpus: CorpusItem[];
  setCorpus(corpus: CorpusItem[]): void;
};

export const useCorpusStore = create<CorpusState>((set) => ({
  corpus: [],
  setCorpus(corpus: CorpusItem[]) {
    set((state) => ({
      ...state,
      corpus,
    }));
  },
}));
