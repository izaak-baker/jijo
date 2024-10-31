import { CorpusItem } from "../state/corpusState.ts";
import { FC, useMemo } from "react";
import { useGameStore } from "../state/gameState.ts";
import { zip } from "../logic/rendering.ts";
import Character from "./Character.tsx";

type Props = {
  item: CorpusItem;
};

const CorpusItemCard: FC<Props> = ({ item }) => {
  const display = useGameStore((state) => state.display);
  const zipped = useMemo(() => zip(item), [item]);

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex items-center gap-2 max-w-[100vw] flex-wrap justify-center">
        {zipped.map(({ targetCharacter, romanizedCharacter }, index) => (
          <Character
            key={index}
            index={index}
            scale={zipped.length > 5 ? "small" : "large"}
            displayTarget={display.target}
            displayRomanized={display.romanized}
            targetElement={targetCharacter}
            romanElement={romanizedCharacter}
          />
        ))}
      </div>
      <div
        className={`text-amber-600 text-center mt-4 ${item.native.join().length > 20 ? "text-xl" : "text-3xl"} font-serif ${!display.native ? "text-transparent" : ""}`}
      >
        {item.native}
      </div>
    </div>
  );
};

export default CorpusItemCard;
