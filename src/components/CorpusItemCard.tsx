import { CorpusItem } from "../state/corpusState.ts";
import { FC, useMemo } from "react";
import { useDisplayStore } from "../state/displayState.ts";

type Props = {
  item: CorpusItem;
};

const CorpusItemCard: FC<Props> = ({ item }) => {
  const display = useDisplayStore((state) => state.display);

  const zipped = useMemo(() => {
    const { target, romanization } = item;
    const result = [];
    for (let i = 0; i < target.length; i++) {
      const element = [target[i]];
      if (i < romanization.length) {
        element.push(romanization[i]);
      } else {
        element.push("");
      }
      result.push(element);
    }
    return result;
  }, [item]);

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex items-center gap-2 max-w-fit">
        {zipped.map(([targetElement, romanElement]) => (
          <div className="flex flex-col items-center gap-2">
            <div
              className={`text-6xl ${!display.target ? "text-transparent" : ""}`}
            >
              {targetElement}
            </div>
            <div
              className={`font-mono ${!display.target && display.romanized ? "text-lg" : "text-sm"} ${!display.romanized ? "text-transparent" : ""}`}
            >
              {romanElement}
            </div>
          </div>
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
