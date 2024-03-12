import { useCorpusStore } from "../state/corpusState.ts";
import { useGameStore } from "../state/gameState.ts";
import { tag } from "../utils/tags.ts";

const Settings = () => {
  const tagOptions = useCorpusStore((state) => state.tagOptions);
  const excludedTagOptions = useGameStore((state) => state.excludedTagOptions);
  const toggleTag = useGameStore((state) => state.toggleTag);

  return (
    <div>
      {Object.entries(tagOptions).map(([key, values]) => (
        <div className="block p-4" key={key}>
          <div className="font-bold text-xl mb-4">{key}</div>
          <div className="pl-2">
            {[...values].map((value) => {
              const format: string = excludedTagOptions[key]?.has(value)
                ? "text-neutral-400"
                : "font-bold text-violet-500";
              const className = `text-wrap p-1 ${format}`;
              return (
                <div
                  key={value}
                  className={className}
                  onClick={() => toggleTag(tag(value, key))}
                >
                  {value}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Settings;
