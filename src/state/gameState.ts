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

export type GameMode = "quiz" | "endless";

export type QuizResults = {
  correct: number;
  incorrect: number;
  skipped: number;
  total: number;
};

export type GameState = {
  gameMode?: GameMode;
  chosenItem?: CorpusItem;
  display: DisplayOptions;
  stagedHistoryEntry?: Omit<SessionHistoryEntry, "outcome">;
  sessionHistory: SessionHistoryEntry[];
  quizQueue: CorpusItem[];
  quizIndex: number;
  lastQuizResults?: QuizResults;
  toggleDisplay(key: string): void;
  stageHistoryEntry(partialEntry: Omit<SessionHistoryEntry, "outcome">): void;
  recordHistoryEntry(outcome: FlashcardOutcome): void;
  setChosenItem(item?: CorpusItem): void;
  startGame(mode: GameMode, corpus: CorpusItem[]): void;
  stopGame(): void;
};

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const useGameStore = create<GameState>((set) => ({
  sessionHistory: [],
  quizQueue: [],
  quizIndex: 0,
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
  setChosenItem(item?: CorpusItem) {
    set((state) => ({
      ...state,
      chosenItem: item,
    }));
  },
  startGame(mode: GameMode, corpus: CorpusItem[]) {
    set((state) => {
      if (mode === "quiz") {
        const queue = shuffle(corpus);
        return {
          ...state,
          gameMode: mode,
          quizQueue: queue,
          quizIndex: 0,
          chosenItem: queue[0],
          sessionHistory: [],
          stagedHistoryEntry: { display: state.display, item: queue[0] },
          lastQuizResults: undefined,
        };
      }
      // endless
      const indexChosen = Math.floor(Math.random() * corpus.length);
      const item = corpus[indexChosen];
      return {
        ...state,
        gameMode: mode,
        quizQueue: [],
        quizIndex: 0,
        chosenItem: item,
        sessionHistory: [],
        stagedHistoryEntry: { display: state.display, item },
      };
    });
  },
  stopGame() {
    set((state) => {
      const results: QuizResults | undefined =
        state.gameMode === "quiz"
          ? {
              correct: state.sessionHistory.filter(
                (e) => e.outcome === "correct",
              ).length,
              incorrect: state.sessionHistory.filter(
                (e) => e.outcome === "incorrect",
              ).length,
              skipped: state.sessionHistory.filter(
                (e) => e.outcome === "skip",
              ).length,
              total: state.sessionHistory.length,
            }
          : undefined;
      return {
        ...state,
        gameMode: undefined,
        chosenItem: undefined,
        quizQueue: [],
        quizIndex: 0,
        stagedHistoryEntry: undefined,
        lastQuizResults: results,
      };
    });
  },
}));
