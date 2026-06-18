import CircleButton from "../components/CircleButton.tsx";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import { FaAnglesLeft, FaHashtag, FaCheck, FaX } from "react-icons/fa6";
import { useCorpusStore } from "../state/corpusState.ts";
import { FlashcardOutcome, useGameStore } from "../state/gameState.ts";
import { useCallback, useMemo } from "react";
import CorpusItemCard from "../components/CorpusItemCard.tsx";
import FooterButton from "../components/FooterButton.tsx";
import { ItemTag, tagKey, tagValue } from "../logic/tags.ts";

const TAG_COLOR_ORDER: string[] = [
  "bg-violet-500",
  "bg-violet-400",
  "bg-violet-300",
  "bg-violet-200",
];

const Play = () => {
  const corpus = useCorpusStore((state) => state.corpus);
  const filteredCorpus = useCorpusStore((state) => state.filteredCorpus);
  const chosenItem = useGameStore((state) => state.chosenItem);
  const toggleDisplay = useGameStore((state) => state.toggleDisplay);
  const stageHistoryEntry = useGameStore((state) => state.stageHistoryEntry);
  const recordHistoryEntry = useGameStore((state) => state.recordHistoryEntry);
  const display = useGameStore((state) => state.display);
  const setChosenItem = useGameStore((state) => state.setChosenItem);
  const gameMode = useGameStore((state) => state.gameMode);
  const quizQueue = useGameStore((state) => state.quizQueue);
  const quizIndex = useGameStore((state) => state.quizIndex);
  const startGame = useGameStore((state) => state.startGame);
  const stopGame = useGameStore((state) => state.stopGame);
  const lastQuizResults = useGameStore((state) => state.lastQuizResults);

  const handleNextButtonClick = useCallback(
    (outcome: FlashcardOutcome) => {
      recordHistoryEntry(outcome);

      if (gameMode === "quiz") {
        const nextIndex = quizIndex + 1;
        if (nextIndex >= quizQueue.length) {
          // Quiz complete — stopGame will compute results
          stopGame();
          return;
        }
        const item = quizQueue[nextIndex];
        setChosenItem(item);
        useGameStore.setState({ quizIndex: nextIndex });
        stageHistoryEntry({ display, item });
      } else {
        const indexChosen = Math.floor(Math.random() * filteredCorpus.length);
        const item = filteredCorpus[indexChosen];
        setChosenItem(item);
        stageHistoryEntry({ display, item });
      }
    },
    [
      gameMode,
      quizQueue,
      quizIndex,
      setChosenItem,
      filteredCorpus,
      display,
      recordHistoryEntry,
      stageHistoryEntry,
      stopGame,
    ],
  );

  const tagCount = useMemo(() => chosenItem?.tags?.length || 0, [chosenItem]);

  const correctPct = lastQuizResults
    ? Math.round((lastQuizResults.correct / lastQuizResults.total) * 100)
    : 0;
  const incorrectPct = lastQuizResults
    ? Math.round((lastQuizResults.incorrect / lastQuizResults.total) * 100)
    : 0;
  const skippedPct = lastQuizResults
    ? Math.round((lastQuizResults.skipped / lastQuizResults.total) * 100)
    : 0;

  // Mode selection / idle screen
  if (!gameMode) {
    return (
      <div className="flex flex-col items-stretch h-full">
        <div className="grow p-4 flex flex-col items-center justify-center">
          <div className="flex flex-col gap-4 items-center">
            <div className="text-7xl font-bold text-neutral-300">自助</div>
            {filteredCorpus.length === 0 ? (
              <div className="text-lg text-neutral-400">
                No vocabulary! ({corpus.length} in Dictionary)
              </div>
            ) : (
              <>
                {lastQuizResults && (
                  <div className="w-full max-w-xs mb-4">
                    <div className="text-sm font-bold text-neutral-500 text-center mb-2">
                      Last Quiz
                    </div>
                    <div className="flex gap-2 justify-center text-sm font-bold">
                      <div className="bg-green-200 text-green-600 rounded px-3 py-1">
                        {correctPct}% correct
                      </div>
                      <div className="bg-red-200 text-red-600 rounded px-3 py-1">
                        {incorrectPct}% incorrect
                      </div>
                      <div className="bg-neutral-200 text-neutral-600 rounded px-3 py-1">
                        {skippedPct}% skipped
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-4">
                  <button
                    className="px-8 py-4 bg-violet-500 text-white font-bold text-lg rounded"
                    onClick={() => startGame("quiz", filteredCorpus)}
                  >
                    Quiz
                  </button>
                  <button
                    className="px-8 py-4 bg-neutral-500 text-white font-bold text-lg rounded"
                    onClick={() => startGame("endless", filteredCorpus)}
                  >
                    Endless
                  </button>
                </div>
                <div className="text-sm text-neutral-400 mt-2">
                  {filteredCorpus.length} items
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active game screen
  return (
    <div className="flex flex-col items-stretch h-full">
      {display.tags &&
        chosenItem?.tags?.map((tag: ItemTag, i: number) => (
          <div
            className={`p-1 w-full ${TAG_COLOR_ORDER[Math.min(TAG_COLOR_ORDER.length - tagCount + i, TAG_COLOR_ORDER.length - 1)]}`}
          >
            <strong>{tagKey(tag)}</strong> = {tagValue(tag)}
          </div>
        ))}
      <div className="grow p-4 flex flex-col items-center justify-center">
        {chosenItem && <CorpusItemCard item={chosenItem} />}
        {gameMode === "quiz" && (
          <div className="text-sm text-neutral-400 mt-4">
            {quizIndex + 1} / {quizQueue.length}
          </div>
        )}
      </div>
      <div className="h-20 flex items-center gap-2 justify-center text-2xl mb-1">
        <CircleButton
          active={display.target}
          onClick={() => toggleDisplay("target")}
        >
          漢字
        </CircleButton>
        <CircleButton
          active={display.romanized}
          onClick={() => toggleDisplay("romanized")}
        >
          <span className="text-4xl">
            <RxLetterCaseCapitalize />
          </span>
        </CircleButton>
        <CircleButton
          active={display.target || display.romanized}
          onClick={() => {
            toggleDisplay("target");
            toggleDisplay("romanized");
          }}
        >
          <FaAnglesLeft />
        </CircleButton>
        <CircleButton
          active={display.native}
          onClick={() => toggleDisplay("native")}
        >
          <span className="font-bold">EN</span>
        </CircleButton>
        <CircleButton
          active={display.tags}
          onClick={() => toggleDisplay("tags")}
        >
          <FaHashtag />
        </CircleButton>
      </div>
      <div className="flex">
        <FooterButton
          disposition="danger"
          onClick={() => handleNextButtonClick("incorrect")}
        >
          <FaX />
        </FooterButton>
        <FooterButton
          disposition="info"
          onClick={() => handleNextButtonClick("skip")}
        >
          SKIP
        </FooterButton>
        <FooterButton
          disposition="success"
          onClick={() => handleNextButtonClick("correct")}
        >
          <FaCheck />
        </FooterButton>
      </div>
    </div>
  );
};

export default Play;
