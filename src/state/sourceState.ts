import { SheetsSource } from "../source/SheetsSource.ts";
import { create } from "zustand";

export type SourceState = {
  sources: SheetsSource[];
  setSources(sources: SheetsSource[]): void;
  addSource(source: SheetsSource): void;
};

export const useSourceStore = create<SourceState>((set) => ({
  sources: [],
  setSources(sources: SheetsSource[]) {
    set((state) => ({
      ...state,
      sources,
    }));
  },
  addSource(source: SheetsSource) {
    set((state) => {
      const sources = [...state.sources, source];
      return {
        ...state,
        sources,
      };
    });
  },
}));
