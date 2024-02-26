import {useCallback, useState} from "react";
import {FaGear, FaDatabase, FaPlay} from "react-icons/fa6";

const ICON_SIZE = 28;

function App() {
  const [googleLoggedIn, setGoogleLoggedIn] = useState<boolean>(false);
  const [googleSpreadsheetId, setGoogleSpreadsheetId] = useState<string>();
  const [sheetNames, setSheetNames] = useState<string[]>([]);

  const handleButtonClick = useCallback(() => {
    window.googleLogin().then(() => setGoogleLoggedIn(true));
  }, []);

  const handleContinueClick = useCallback(() => {
    if (googleSpreadsheetId) {
      window.getGoogleSpreadsheet(googleSpreadsheetId).then((result) => {
        console.log(result);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setSheetNames(result?.result?.sheets?.map(({ properties }) => properties.title));
      });
    }
  }, [googleSpreadsheetId])

  return (
    <div className="flex flex-col items-stretch h-full">
      <div className="h-16 bg-violet-500 flex items-center pl-4 pr-4 text-white">
        <div className="text-4xl pb-2 font-bold">jijo</div>
        <div className="text-lg ml-2">v0.1</div>
        <div className="top-menu ml-auto flex gap-4">
          <FaPlay size={ICON_SIZE} />
          <FaGear size={ICON_SIZE} />
          <FaDatabase size={ICON_SIZE} />
        </div>
      </div>
      <div className="grow p-4">
        {!googleLoggedIn ? (
          <button className="p-3 bg-neutral-300 rounded" onClick={handleButtonClick}>Link Google Sheets</button>
        ) : (
          <>
            {sheetNames.length == 0 ? (
              <>
                <div>
                  Enter Sheet ID:
                </div>
                <input
                  value={googleSpreadsheetId}
                  onChange={(e) => setGoogleSpreadsheetId(e.target.value)}
                  className="block border-2 border-neutral-300 w-full h-10 mb-2 p-1 rounded"
                />
                <button onClick={handleContinueClick} className="p-3 bg-neutral-300 rounded">Continue</button>
              </>
            ) : (
              <>
                {sheetNames.map((name) => (
                  <div>{name}</div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App;
