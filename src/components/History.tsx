import { useGameStore } from "../state/gameState.ts";
import SessionHistoryEntryRow from "./SessionHistoryEntryRow.tsx";
import { useMemo } from "react";

const History = () => {
  const sessionHistory = useGameStore((state) => state.sessionHistory);

  const displayHistory = useMemo(() => {
    const result = [...sessionHistory];
    result.reverse();
    return result;
  }, [sessionHistory]);

  return (
    <div className="flex flex-col items-stretch h-full">
      <div className="overflow-y-scroll grow-1 flex flex-col overflow-x-hidden">
        {displayHistory.map((entry, index) => (
          <SessionHistoryEntryRow entry={entry} index={index} />
        ))}
      </div>
    </div>
  );
};

export default History;
