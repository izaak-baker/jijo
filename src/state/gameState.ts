import { CorpusItem } from "./corpusState.ts";
import { create } from "zustand";
import { ItemTag, TagOptions, toggleTag } from "../utils/tags.ts";

export type GameState = {
  chosenItem?: CorpusItem;
  excludedTagOptions: TagOptions;
  setChosenItem(item: CorpusItem): void;
  toggleTag(tag: ItemTag): void;
};

export const useGameStore = create<GameState>((set) => ({
  excludedTagOptions: {},
  setChosenItem(item: CorpusItem) {
    set((state) => ({
      ...state,
      chosenItem: item,
    }));
  },
  toggleTag(tag: ItemTag) {
    set((state) => ({
      ...state,
      excludedTagOptions: toggleTag(state.excludedTagOptions, tag),
    }));
  },
}));
