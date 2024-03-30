import { useCallback, useEffect, useMemo, useState } from "react";
import { useCorpusStore } from "../state/corpusState.ts";
import { clientRxdb } from "../main.tsx";
import { SheetsSource } from "../source/SheetsSource.ts";
import { useSourceStore } from "../state/sourceState.ts";
import { v4 } from "uuid";
import { DiarySource } from "../source/DiarySource.ts";
import { AbstractSource } from "../source/AbstractSource.ts";
import { FaBook, FaTable } from "react-icons/fa";

const Configure = () => {
  const [loadingCorpus, setLoadingCorpus] = useState<boolean>(false);
  const [newSourceName, setNewSourceName] = useState<string>();
  const [newSourceType, setNewSourceType] = useState<
    "SheetsSource" | "DiarySource"
  >("SheetsSource");
  const [newSourceDocumentId, setNewSourceDocumentId] = useState<string>();

  const setCorpus = useCorpusStore((state) => state.setCorpus);
  const corpus = useCorpusStore((state) => state.corpus);
  const sources = useSourceStore((state) => state.sources);
  const setSources = useSourceStore((state) => state.setSources);

  const loadSources = useCallback(() => {
    clientRxdb.sources
      .find()
      .exec()
      .then((docs) => docs.map((d) => d.toJSON(true)))
      .then((configs) =>
        configs.map((config) => {
          switch (config.sourceType) {
            case "SheetsSource":
              return new SheetsSource(config);
            case "DiarySource":
              return new DiarySource(config);
          }
          throw new Error(`Invalid source type ${config.sourceType}.`);
        }),
      )
      .then(setSources);
  }, [setSources]);

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  const loadFromSource = useCallback(
    (source: AbstractSource) => {
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
        sourceType: newSourceType,
        documentId: newSourceDocumentId,
      })
      .then(() => {
        loadSources();
        setNewSourceName("");
        setNewSourceDocumentId("");
      });
  }, [loadSources, newSourceName, newSourceDocumentId, newSourceType]);

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
            <div className="text-lg mb-2 flex items-center gap-2">
              <span className="font-bold">
                {source.getSourceType() === "SheetsSource" && <FaTable />}
                {source.getSourceType() === "DiarySource" && <FaBook />}
              </span>
              <span className="font-bold">SOURCE</span>
              {source.getName()}
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
          <div className="flex w-full mt-2 mb-2 gap-2">
            <button
              className={`grow p-2 rounded ${newSourceType === "SheetsSource" ? "font-bold bg-neutral-300" : "bg-neutral-200"}`}
              onClick={() => setNewSourceType("SheetsSource")}
            >
              Sheets Source
            </button>
            <button
              className={`grow p-2 rounded ${newSourceType === "DiarySource" ? "font-bold bg-neutral-300" : "bg-neutral-200"}`}
              onClick={() => setNewSourceType("DiarySource")}
            >
              Diary Source
            </button>
          </div>
          <div>Name:</div>
          <input
            value={newSourceName}
            onChange={(e) => setNewSourceName(e.target.value)}
            className="w-full h-10 border border-neutral-300 mt-2 p-2"
          />
          <div className="mt-2">Document ID:</div>
          <input
            value={newSourceDocumentId}
            onChange={(e) => setNewSourceDocumentId(e.target.value)}
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
