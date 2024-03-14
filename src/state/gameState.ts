import { CorpusItem } from "./corpusState.ts";
import { create } from "zustand";

export type DisplayOptions = {
  target: boolean;
  romanized: boolean;
  native: boolean;
  tags: boolean;
};

export type FlashcardOutcome = "skip" | "correct" | "incorrect";
export type SessionHistoryEntry = {
  item: CorpusItem;
  display: DisplayOptions;
  outcome: FlashcardOutcome;
};

export type GameState = {
  chosenItem?: CorpusItem;
  display: DisplayOptions;
  stagedHistoryEntry?: Omit<SessionHistoryEntry, "outcome">;
  sessionHistory: SessionHistoryEntry[];
  toggleDisplay(key: string): void;
  stageHistoryEntry(partialEntry: Omit<SessionHistoryEntry, "outcome">): void;
  recordHistoryEntry(outcome: FlashcardOutcome): void;
  setChosenItem(item: CorpusItem): void;
};

export const useGameStore = create<GameState>((set) => ({
  sessionHistory: [],
  display: {
    target: true,
    romanized: true,
    native: true,
    tags: true,
  },
  toggleDisplay(key: keyof DisplayOptions) {
    set((state) => ({
      ...state,
      display: {
        ...state.display,
        [key]: !state.display[key],
      },
    }));
  },
  stageHistoryEntry(partialEntry: Omit<SessionHistoryEntry, "outcome">) {
    set((state) => ({
      ...state,
      stagedHistoryEntry: partialEntry,
    }));
  },
  recordHistoryEntry(outcome: FlashcardOutcome) {
    set((state) => {
      if (!state.stagedHistoryEntry) return { ...state };
      const entry: SessionHistoryEntry = {
        ...state.stagedHistoryEntry,
        outcome,
      };
      return {
        ...state,
        sessionHistory: [...state.sessionHistory, entry],
      };
    });
  },
  setChosenItem(item: CorpusItem) {
    set((state) => ({
      ...state,
      chosenItem: item,
    }));
  },
}));
