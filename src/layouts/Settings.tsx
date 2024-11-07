import { useCorpusStore } from "../state/corpusState.ts";
import { itemTag } from "../logic/tags.ts";
import ResponsiveContainer from "../components/ResponsiveContainer.tsx";

const Settings = () => {
  const tagOptions = useCorpusStore((state) => state.tagOptions);
  const excludeAll = useCorpusStore((state) => state.excludeAll);
  const includeAll = useCorpusStore((state) => state.includeAll);
  const activeTagOptions = useCorpusStore((state) => state.activeTagOptions);
  const toggleTag = useCorpusStore((state) => state.toggleTag);
  const filterType = useCorpusStore((state) => state.filterType);
  const setFilterType = useCorpusStore((state) => state.setFilterType);

  return (
    <ResponsiveContainer>
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
        <div className="font-bold text-xl mb-2 mt-4">Match:</div>
        <div className="flex gap-2 w-full mt-2">
          <button
            className={`p-3 bg-neutral-200 grow rounded ${filterType === "any" ? "font-bold" : "bg-neutral-100"}`}
            onClick={() => setFilterType("any")}
          >
            Any
          </button>
          <button
            className={`p-3 bg-neutral-200 grow rounded ${filterType === "all" ? "font-bold" : "bg-neutral-100"}`}
            onClick={() => setFilterType("all")}
          >
            All
          </button>
        </div>
        {Object.entries(tagOptions).map(([key, values]) => (
          <div className="mt-4" key={key}>
            <div className="font-bold text-xl mb-4">{key}</div>
            <div className="pl-2">
              {[...values].map((value) => {
                const format: string = activeTagOptions[key]?.has(value)
                  ? "font-bold text-violet-500"
                  : "text-neutral-400";
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
    </ResponsiveContainer>
  );
};

export default Settings;
