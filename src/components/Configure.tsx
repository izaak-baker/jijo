import { useCallback, useEffect, useMemo, useState } from "react";
import { useCorpusStore } from "../state/corpusState.ts";
import { clientRxdb } from "../main.tsx";
import { SheetsSource } from "../source/SheetsSource.ts";
import { useSourceStore } from "../state/sourceState.ts";
import { v4 } from "uuid";

const Configure = () => {
  const [loadingCorpus, setLoadingCorpus] = useState<boolean>(false);
  const [newSourceName, setNewSourceName] = useState<string>();
  const [newSourceSpreadsheetId, setNewSourceSpreadsheetId] =
    useState<string>();

  const setCorpus = useCorpusStore((state) => state.setCorpus);
  const corpus = useCorpusStore((state) => state.corpus);
  const sources = useSourceStore((state) => state.sources);
  const setSources = useSourceStore((state) => state.setSources);

  const loadSources = useCallback(() => {
    clientRxdb.sources
      .find()
      .exec()
      .then((docs) => docs.map((d) => d.toJSON(true)))
      .then((configs) => configs.map((c) => new SheetsSource(c)))
      .then(setSources);
  }, [setSources]);

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  const loadFromSource = useCallback(
    (source: SheetsSource) => {
      setCorpus([]);
      setLoadingCorpus(true);
      source
        .loadCorpus()
        .then(setCorpus)
        .finally(() => setLoadingCorpus(false));
    },
    [setCorpus],
  );

  const deleteSource = useCallback(
    (id: string) => {
      clientRxdb.sources
        .findOne({ selector: { id } })
        .exec()
        .then((source) => source.remove())
        .then(loadSources);
    },
    [loadSources],
  );

  const createSource = useCallback(() => {
    clientRxdb.sources
      .upsert({
        id: v4(),
        name: newSourceName,
        spreadsheetId: newSourceSpreadsheetId,
      })
      .then(() => {
        loadSources();
        setNewSourceName("");
        setNewSourceSpreadsheetId("");
      });
  }, [loadSources, newSourceName, newSourceSpreadsheetId]);

  const bgColor = useMemo(
    () => (corpus.length > 0 ? "bg-green-400" : "bg-neutral-200"),
    [corpus],
  );

  const message = useMemo(() => {
    if (corpus.length > 0) return `Loaded ${corpus.length} items.`;
    if (loadingCorpus) return "Loading...";
    return "No items.";
  }, [corpus, loadingCorpus]);

  return (
    <div className="h-full flex flex-col">
      <div
        className={`w-full flex items-center text-lg justify-center h-12 ${bgColor}`}
      >
        {message}
      </div>
      <div className="grow p-4 flex flex-col gap-4">
        {sources.map((source) => (
          <div
            className="border-l-neutral-500 border-l-8 p-4 bg-neutral-200"
            key={source.getId()}
          >
            <div className="text-lg mb-2">
              <span className="font-bold">SOURCE</span>: {source.getName()}
            </div>
            <div className="flex gap-2 font-bold">
              <button
                className="flex-1 p-2 bg-violet-300 rounded"
                onClick={() => loadFromSource(source)}
              >
                Load
              </button>
              <button
                className="flex-1 p-2 bg-red-300 rounded"
                onClick={() => deleteSource(source.getId())}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        <div className="border-l-neutral-300 border-l-8 p-4 bg-neutral-100 text-neutral-700">
          <div className="text-lg mb-2 font-bold">NEW SOURCE</div>
          <div>Name:</div>
          <input
            value={newSourceName}
            onChange={(e) => setNewSourceName(e.target.value)}
            className="w-full h-10 border border-neutral-300 mt-2 p-2"
          />
          <div className="mt-2">Spreadsheet ID:</div>
          <input
            value={newSourceSpreadsheetId}
            onChange={(e) => setNewSourceSpreadsheetId(e.target.value)}
            className="w-full h-10 border border-neutral-300 mt-2 p-2"
          />
          <button
            className="w-full p-2 mt-4 bg-green-300 text-black font-bold"
            onClick={createSource}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default Configure;
