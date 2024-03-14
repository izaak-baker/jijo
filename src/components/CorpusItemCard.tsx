import { CorpusItem } from "../state/corpusState.ts";
import { FC, useMemo } from "react";
import { useGameStore } from "../state/gameState.ts";
import { zip } from "../utils/rendering.ts";
import Character from "./Character.tsx";

type Props = {
  item: CorpusItem;
};

const CorpusItemCard: FC<Props> = ({ item }) => {
  const display = useGameStore((state) => state.display);
  const zipped = useMemo(() => zip(item), [item]);

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex items-center gap-2 max-w-fit">
        {zipped.map(([targetElement, romanElement], index) => (
          <Character
            key={index}
            index={index}
            scale="large"
            displayTarget={display.target}
            displayRomanized={display.romanized}
            targetElement={targetElement}
            romanElement={romanElement}
          />
        ))}
      </div>
      <div
        className={`text-amber-600 mt-4 text-3xl font-serif ${!display.native ? "text-transparent" : ""}`}
      >
        {item.native}
      </div>
    </div>
  );
};

export default CorpusItemCard;
