import { useGameStore } from "../state/gameState.ts";
import SessionHistoryEntryRow from "./SessionHistoryEntryRow.tsx";

const BULLET_COLORS: { [key: string]: string } = {
  skip: "bg-neutral-300",
  incorrect: "bg-red-300",
  correct: "bg-green-300",
};

const History = () => {
  const sessionHistory = useGameStore((state) => state.sessionHistory);

  return (
    <div className="flex flex-col items-stretch h-full">
      <div className="overflow-y-scroll grow-1 flex flex-col-reverse overflow-x-hidden">
        {sessionHistory.map((entry, index) => (
          <div
            key={index}
            className={`p-4 flex items-center ${index % 2 === 0 ? "bg-neutral-100" : "bg-white"}`}
          >
            <div
              className={`w-8 h-8 rounded-full mr-4 ${BULLET_COLORS[entry.outcome]}`}
            />
            <div>
              <div className={!entry.display.target ? "opacity-25" : ""}>
                <SessionHistoryEntryRow entry={entry} />
              </div>
              <div className={!entry.display.native ? "opacity-25" : ""}>
                <div className="text-amber-600 font-serif">
                  {entry.item.native.join()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
