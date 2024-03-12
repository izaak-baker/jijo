import { useCallback, useEffect, useState } from "react";
import { CorpusItem, useCorpusStore } from "../state/corpusState.ts";
import { tag } from "../utils/tags.ts";

const Configure = () => {
  const [googleLoggedIn, setGoogleLoggedIn] = useState<boolean>(false);
  const [spreadsheetId, setSpreadsheetId] = useState<string>();
  const setCorpus = useCorpusStore((state) => state.setCorpus);
  const corpus = useCorpusStore((state) => state.corpus);

  useEffect(() => {
    setGoogleLoggedIn(window.trySetupClientFromStorage());
  }, []);

  const handleLoginClick = useCallback(() => {
    window.googleLogin().then(() => setGoogleLoggedIn(true));
  }, []);

  const handleContinueClick = useCallback(() => {
    if (!spreadsheetId) return;
    const loadCorpus = async () => {
      const spreadsheetResponse =
        await window.getGoogleSpreadsheet(spreadsheetId);
      const sheetNames = spreadsheetResponse?.result?.sheets
        ?.map((sheet: any) => sheet.properties.title)
        ?.filter((title: string) => title.includes("Vocab"));
      if (!sheetNames) return;
      const items: CorpusItem[] = [];
      for (const sheetName of sheetNames) {
        const valuesResponse = await window.getSpreadsheetValues(
          spreadsheetId,
          `${sheetName}!A:C`,
        );
        const range = valuesResponse.result;
        if (!range || !range.values || range.values.length === 0) {
          continue;
        }
        let lessonTag;
        let subjectTag;
        for (const row of range.values) {
          if (row.length === 0) continue;
          const tags = [];
          if (lessonTag) tags.push(tag(lessonTag, "Lesson"));
          if (subjectTag) tags.push(tag(subjectTag, "Subject"));
          if (row[2]) {
            items.push({
              target: row[0].split(""),
              romanization: row[1].split(/\s+/),
              native: [row[2]],
              tags,
            });
          } else if (row[0].startsWith("Lesson")) {
            lessonTag = row[0].split(": ")[1];
          } else {
            subjectTag = row[0];
          }
        }
      }
      setCorpus(items);
    };
    loadCorpus().catch(console.error);
  }, [spreadsheetId, setCorpus]);

  const handleResetClick = useCallback(() => {
    window.googleLogout();
    setGoogleLoggedIn(false);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="grow p-4">
        {!googleLoggedIn && (
          <button
            className="p-3 bg-neutral-200 rounded w-full"
            onClick={handleLoginClick}
          >
            Link Google Sheets
          </button>
        )}
        {googleLoggedIn && (
          <>
            {corpus.length == 0 ? (
              <>
                <div>Enter Sheet ID:</div>
                <input
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  className="block border-2 border-neutral-300 w-full h-10 mb-2 p-1 rounded"
                />
                <button
                  onClick={handleContinueClick}
                  className="p-3 bg-neutral-200 rounded w-full"
                >
                  Continue
                </button>
              </>
            ) : (
              <div>
                Done! Added <strong>{corpus.length}</strong> items.
              </div>
            )}
          </>
        )}
      </div>
      <div
        className="h-16 flex items-center pl-4 pr-4 bg-red-500 justify-center"
        onClick={handleResetClick}
      >
        <div className="text-white text-2xl font-bold">RESET</div>
      </div>
    </div>
  );
};

export default Configure;
