import { SessionHistoryEntry } from "../state/gameState.ts";
import { FC, useMemo } from "react";
import { zip } from "../utils/rendering.ts";
import Character from "./Character.tsx";

interface Props {
  entry: SessionHistoryEntry;
}

const SessionHistoryEntryRow: FC<Props> = ({ entry }) => {
  const zipped = useMemo(() => zip(entry.item), [entry]);

  return (
    <div className="flex gap-2">
      {zipped.map(([target, roman], index) => (
        <Character
          key={index}
          index={index}
          scale="small"
          displayTarget
          displayRomanized
          targetElement={target}
          romanElement={roman}
        />
      ))}
    </div>
  );
};

export default SessionHistoryEntryRow;
