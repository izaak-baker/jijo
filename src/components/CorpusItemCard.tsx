import {CorpusItem} from "../state/corpusState.ts";
import {FC, useMemo} from "react";

type Props = {
  item: CorpusItem;
};

const CorpusItemCard: FC<Props> = ({ item }) => {
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
            <div className="text-6xl">{targetElement}</div>
            <div className="font-mono text-sm">{romanElement}</div>
          </div>
        ))}
      </div>
      <div className="text-amber-600 mt-4 text-3xl font-serif">{item.native}</div>
    </div>
  );
}

export default CorpusItemCard;