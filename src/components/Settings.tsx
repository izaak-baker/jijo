import { useCorpusStore } from "../state/corpusState.ts";
import { itemTag } from "../utils/tags.ts";

const Settings = () => {
  const tagOptions = useCorpusStore((state) => state.tagOptions);
  const excludeAll = useCorpusStore((state) => state.excludeAll);
  const includeAll = useCorpusStore((state) => state.includeAll);
  const excludedTagOptions = useCorpusStore(
    (state) => state.excludedTagOptions,
  );
  const toggleTag = useCorpusStore((state) => state.toggleTag);

  return (
    <div className="p-4">
      <button
        className="p-3 bg-neutral-200 rounded w-full mb-2"
        onClick={excludeAll}
      >
        Exclude All
      </button>
      <button
        className="p-3 bg-neutral-200 rounded w-full"
        onClick={includeAll}
      >
        Include All
      </button>
      {Object.entries(tagOptions).map(([key, values]) => (
        <div className="mt-4" key={key}>
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
                  onClick={() => toggleTag(itemTag(value, key))}
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
