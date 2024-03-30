import { AbstractSource } from "../source/AbstractSource.ts";
import { create } from "zustand";

export type SourceState = {
  sources: AbstractSource[];
  setSources(sources: AbstractSource[]): void;
  addSource(source: AbstractSource): void;
};

export const useSourceStore = create<SourceState>((set) => ({
  sources: [],
  setSources(sources: AbstractSource[]) {
    set((state) => ({
      ...state,
      sources,
    }));
  },
  addSource(source: AbstractSource) {
    set((state) => {
      const sources = [...state.sources, source];
      return {
        ...state,
        sources,
      };
    });
  },
}));
