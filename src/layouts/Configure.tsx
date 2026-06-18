import { useCallback, useEffect, useMemo, useState } from "react";
import { useCorpusStore } from "../state/corpusState.ts";
import { clientRxdb } from "../main.tsx";
import { SheetsSource } from "../source/SheetsSource.ts";
import { useSourceStore } from "../state/sourceState.ts";
import { v4 } from "uuid";
import { DiarySource } from "../source/DiarySource.ts";
import { AbstractSource } from "../source/AbstractSource.ts";
import { FaBook, FaTable } from "react-icons/fa";
import ResponsiveContainer from "../components/ResponsiveContainer.tsx";
import { performGoogleOperation } from "../logic/util.ts";
import { getGoogleSpreadsheet } from "../logic/google.ts";
import { SourceConfig } from "../logic/rxdb.ts";
import { useGameStore } from "../state/gameState.ts";

const Configure = () => {
  const [loadingCorpus, setLoadingCorpus] = useState<boolean>(false);
  const [newSourceName, setNewSourceName] = useState<string>();
  const [newSourceUrl, setNewSourceUrl] = useState<string>();
  const [newSourceRemoteName, setNewSourceRemoteName] = useState<string>();
  const [newSourceType, setNewSourceType] = useState<
    "SheetsSource" | "DiarySource"
  >("SheetsSource");
  const [newSourceSheetNames, setNewSourceSheetNames] = useState<
    Record<string, boolean>
  >({});
  const [newSourceDocumentId, setNewSourceDocumentId] = useState<string>();
  const [newSourceLocale, setNewSourceLocale] = useState<string>("zh-Hant");

  const setCorpus = useCorpusStore((state) => state.setCorpus);
  const setChosenItem = useGameStore((state) => state.setChosenItem);
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
          console.log(config);
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
        .finally(() => {
          setLoadingCorpus(false);
          setChosenItem();
        });
    },
    [setCorpus, setChosenItem],
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
    if (
      !newSourceName ||
      !newSourceDocumentId ||
      !newSourceRemoteName ||
      !newSourceUrl
    )
      return; // TODO: some better error
    const source: SourceConfig = {
      id: v4(),
      name: newSourceName,
      sourceType: newSourceType,
      documentId: newSourceDocumentId,
      sheetNames: Object.entries(newSourceSheetNames)
        .filter(([, include]) => include)
        .map(([name]) => name),
      remoteName: newSourceRemoteName,
      url: newSourceUrl,
      locale: newSourceLocale,
    };
    clientRxdb.sources.upsert(source).then(() => {
      loadSources();
      setNewSourceSheetNames({});
      setNewSourceName("");
      setNewSourceDocumentId("");
      setNewSourceRemoteName("");
      setNewSourceUrl("");
      setNewSourceLocale("zh-Hant");
    });
  }, [
    loadSources,
    newSourceName,
    newSourceDocumentId,
    newSourceType,
    newSourceSheetNames,
    newSourceRemoteName,
    newSourceUrl,
    newSourceLocale,
  ]);

  const handleDocumentIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const match = value.match(
        /docs\.google\.com\/(?:spreadsheets|document)\/d\/([a-zA-Z0-9_-]+)/,
      );
      setNewSourceDocumentId(match ? match[1] : value);
    },
    [],
  );

  const clearSourceSheetNames = useCallback(() => {
    setNewSourceSheetNames({});
    setNewSourceRemoteName("");
    setNewSourceUrl("");
  }, [setNewSourceSheetNames, setNewSourceRemoteName, setNewSourceUrl]);

  const loadSourceSheetNames = useCallback(async () => {
    if (!newSourceDocumentId) return;
    const spreadsheetResponse = await performGoogleOperation(
      async () => await getGoogleSpreadsheet(newSourceDocumentId),
    );
    const value: Record<string, boolean> = {};
    setNewSourceRemoteName(spreadsheetResponse.properties.title);
    setNewSourceUrl(spreadsheetResponse.spreadsheetUrl);
    spreadsheetResponse.sheets.forEach(
      (sheet) => (value[sheet.properties.title] = true),
    );
    setNewSourceSheetNames(value);
  }, [newSourceDocumentId]);

  const toggleSheetName = useCallback(
    (name: string) => {
      const newValue = { ...newSourceSheetNames };
      newValue[name] = !newSourceSheetNames[name];
      setNewSourceSheetNames(newValue);
    },
    [newSourceSheetNames, setNewSourceSheetNames],
  );

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
        className={`w-full flex items-center text-lg shrink-0 justify-center h-12 ${bgColor}`}
      >
        {message}
      </div>
      <ResponsiveContainer>
        <div className="grow p-4 flex flex-col gap-4 sm:min-w-[896px]">
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
              <div>
                <strong>From</strong>:{" "}
                <em>
                  <a
                    className="text-violet-600 cursor-pointer"
                    href={source.getUrl()}
                  >
                    {source.getRemoteName()}
                  </a>
                </em>
              </div>
              {source.getSourceType() === "SheetsSource" && (
                <>
                  <div>
                    <strong>Locale</strong>:{" "}
                    {source.getLocale() === "zh-Hant" && <span>漢字</span>}
                    {source.getLocale() === "hi" && <span>देवनागरी</span>}
                  </div>
                  <div>
                    <strong>Sheets</strong>:{" "}
                    <em>
                      {(source as SheetsSource).getSheetNames().join(", ")}
                    </em>
                  </div>
                </>
              )}
              <div className="flex gap-2 font-bold mt-4">
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
            {Object.keys(newSourceSheetNames).length == 0 ? (
              <>
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
                <div className="mt-2">Document ID or URL:</div>
                <input
                  value={newSourceDocumentId}
                  onChange={handleDocumentIdChange}
                  className="w-full h-10 border border-neutral-300 mt-2 p-2"
                  placeholder="Paste a Google Docs/Sheets URL or document ID"
                />
                <button
                  className="w-full p-2 mt-4 bg-green-300 text-black font-bold"
                  onClick={loadSourceSheetNames}
                >
                  Next
                </button>
              </>
            ) : (
              <>
                {newSourceType === "SheetsSource" && (
                  <div className="mb-4">
                    <div className="mb-2 font-bold">Select Locale</div>
                    <input
                      type="checkbox"
                      id={"zh-Hant"}
                      value={"zh-Hant"}
                      checked={newSourceLocale === "zh-Hant"}
                      onChange={() => setNewSourceLocale("zh-Hant")}
                    />
                    <label className="ml-2 mr-4" htmlFor={"zh-Hant"}>
                      漢字
                    </label>
                    <input
                      type="checkbox"
                      id={"hi"}
                      value={"hi"}
                      checked={newSourceLocale === "hi"}
                      onChange={() => setNewSourceLocale("hi")}
                    />
                    <label className="ml-2" htmlFor={"hi"}>
                      देवनागरी
                    </label>
                  </div>
                )}
                <div className="mb-2 font-bold">Select sheets to include:</div>
                {Object.keys(newSourceSheetNames).map((name) => (
                  <div>
                    <input
                      type="checkbox"
                      id={name}
                      value={name}
                      checked={newSourceSheetNames[name]}
                      onChange={() => toggleSheetName(name)}
                    />
                    <label className="ml-2" htmlFor={name}>
                      {name}
                    </label>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    className="w-full p-2 mt-4 bg-neutral-300"
                    onClick={clearSourceSheetNames}
                  >
                    Back
                  </button>
                  <button
                    className="w-full p-2 mt-4 bg-green-300 text-black fond-bold"
                    onClick={createSource}
                  >
                    Create
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default Configure;
