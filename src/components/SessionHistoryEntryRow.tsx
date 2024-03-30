import { SessionHistoryEntry } from "../state/gameState.ts";
import { FC, useMemo } from "react";
import { zip } from "../logic/rendering.ts";
import Character from "./Character.tsx";

const BULLET_COLORS: { [key: string]: string } = {
  skip: "bg-neutral-300",
  incorrect: "bg-red-300",
  correct: "bg-green-300",
};

interface Props {
  index: number;
  entry: SessionHistoryEntry;
}

const SessionHistoryEntryRow: FC<Props> = ({ index, entry }) => {
  const zipped = useMemo(() => zip(entry.item), [entry]);

  return (
    <div key={index} className="p-4 flex items-center">
      <div
        className={`w-8 h-8 rounded-full shrink-0 mr-4 ${BULLET_COLORS[entry.outcome]}`}
      />
      <div>
        <div className="flex gap-2">
          {zipped.map(([target, roman], index) => (
            <Character
              key={index}
              index={index}
              scale="small"
              displayTarget
              fadeTarget={!entry.display.target}
              displayRomanized
              fadeRomanized={!entry.display.romanized}
              targetElement={target}
              romanElement={roman}
            />
          ))}
        </div>
        <div className={!entry.display.native ? "opacity-25" : ""}>
          <div className="text-amber-600 font-serif">
            {entry.item.native.join()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionHistoryEntryRow;
