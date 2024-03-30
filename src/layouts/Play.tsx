import CircleButton from "../components/CircleButton.tsx";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import { FaAnglesLeft, FaHashtag, FaCheck, FaX } from "react-icons/fa6";
import { useCorpusStore } from "../state/corpusState.ts";
import { FlashcardOutcome, useGameStore } from "../state/gameState.ts";
import { useCallback } from "react";
import CorpusItemCard from "../components/CorpusItemCard.tsx";
import FooterButton from "../components/FooterButton.tsx";

const Play = () => {
  const corpus = useCorpusStore((state) => state.corpus);
  const filteredCorpus = useCorpusStore((state) => state.filteredCorpus);
  const chosenItem = useGameStore((state) => state.chosenItem);
  const toggleDisplay = useGameStore((state) => state.toggleDisplay);
  const stageHistoryEntry = useGameStore((state) => state.stageHistoryEntry);
  const recordHistoryEntry = useGameStore((state) => state.recordHistoryEntry);
  const display = useGameStore((state) => state.display);
  const setChosenItem = useGameStore((state) => state.setChosenItem);

  const handleNextButtonClick = useCallback(
    (outcome: FlashcardOutcome) => {
      const indexChosen = Math.floor(Math.random() * filteredCorpus.length);
      const item = filteredCorpus[indexChosen];
      setChosenItem(item);
      recordHistoryEntry(outcome);
      stageHistoryEntry({ display, item });
    },
    [
      setChosenItem,
      filteredCorpus,
      display,
      recordHistoryEntry,
      stageHistoryEntry,
    ],
  );

  return (
    <div className="flex flex-col items-stretch h-full">
      <div className="grow p-4 flex flex-col items-center justify-center">
        {!chosenItem ? (
          <div className="flex flex-col gap-4 items-center">
            <div className="text-7xl font-bold text-neutral-300">自助</div>
            <div className="text-lg text-neutral-400">
              {filteredCorpus.length === 0 ? (
                <span>No vocabulary! ({corpus.length} in Dictionary)</span>
              ) : (
                <span>
                  Click <strong>Next</strong> to begin!
                </span>
              )}
            </div>
          </div>
        ) : (
          <CorpusItemCard item={chosenItem} />
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
