import {create} from "zustand";

type DisplayOptions = {
  target: boolean;
  romanized: boolean;
  native: boolean;
  tags: boolean;
};

type DisplayStoreState = {
  display: DisplayOptions;
  toggleDisplay(key: string): void;
}

export const useDisplayStore = create<DisplayStoreState>((set) => ({
  display: {
    target: true,
    romanized: true,
    native: true,
    tags: true
  },
  toggleDisplay(key: keyof DisplayOptions) {
    set((state) => ({
      ...state,
      display: {
        ...state.display,
        [key]: !state.display[key]
      }
    }));
  }
}));