import { CorpusItem } from "./corpusState.ts";
import { create } from "zustand";

export type GameState = {
  chosenItem?: CorpusItem;
  setChosenItem(item: CorpusItem): void;
};

export const useGameStore = create<GameState>((set) => ({
  excludedTagOptions: {},
  setChosenItem(item: CorpusItem) {
    set((state) => ({
      ...state,
      chosenItem: item,
    }));
  },
}));
