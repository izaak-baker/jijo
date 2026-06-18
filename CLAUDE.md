# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Type-check + build for production
npm run lint      # ESLint (zero warnings allowed)
npm run prettier  # Format src/**/*.{tsx,ts}
```

There are no tests in this project.

## Architecture

Jijo is a BYOB (bring-your-own-book) flashcard app for English speakers learning non-Roman script languages. It is a client-side-only React/TypeScript SPA deployed to Netlify.

### Google API Integration

The Google OAuth2 and API client (GAPI) are loaded as vanilla scripts in `index.html` and exposed as globals on `window`. TypeScript types for these globals are declared in `src/global.d.ts`. All Google API calls go through `src/logic/util.ts:performGoogleOperation`, which handles token refresh/login automatically.

**Two source types** pull vocabulary from Google:
- `SheetsSource` — reads rows from a Google Spreadsheet. Rows with `key=value` in column A set "active tags" that apply to all subsequent rows. Column D holds per-item tags (comma-separated `key=value` or plain strings).
- `DiarySource` — parses vocabulary from a Google Doc using a regex pattern matching `target (romanization "native")`.

Both extend `AbstractSource` in `src/source/`.

### Data Layer

`src/logic/rxdb.ts` sets up an RxDB (Dexie/IndexedDB) database that persists `SourceConfig` objects (name, documentId, sheetNames, locale, etc.). The exported `clientRxdb` instance is initialized at module level in `main.tsx` and imported directly into components that need DB access.

### State (Zustand)

Three Zustand stores in `src/state/`:
- `corpusState` — holds the loaded `CorpusItem[]`, manages tag-based filtering (`TagOptions`, `FilterType` "any"/"all")
- `gameState` — tracks the active flashcard session: chosen item, display toggles (target/romanized/native/tags), and session history (skip/correct/incorrect outcomes)
- `sourceState` — holds in-memory `AbstractSource[]` instances

### CorpusItem Shape

```ts
type CorpusItem = {
  target: string[];       // segmented characters/words (locale-aware via Intl.Segmenter)
  romanization: string[]; // split on whitespace
  native: string[];       // English translation
  tags: ItemTag[];        // string | { key: string; value: string }
}
```

`src/logic/rendering.ts:zip` pairs `target[i]` with `romanization[i]` for character-by-character display.

### Routing

`wouter` provides client-side routing. Routes are defined in `src/layouts/App.tsx`:
- `/` → `Play` (flashcard game)
- `/configure` → `Configure` (manage sources, load corpus)
- `/settings` → `Settings`
- `/history` → `History` (session results)
- `/docs` → `Docs`

### Locales

`SheetsSource` uses `Intl.Segmenter` to split target text. Chinese (`zh-Hant`) segments by grapheme; other locales segment by word. Currently supported locales in the UI: `zh-Hant` (Traditional Chinese) and `hi` (Hindi/Devanagari).