import {useCallback, useState} from "react";
import {FaGear, FaDatabase, FaPlay, FaHashtag, FaAnglesLeft} from "react-icons/fa6";
import { RxLetterCaseCapitalize } from "react-icons/rx";


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
          <button className="p-3 bg-neutral-200 rounded" onClick={handleButtonClick}>Link Google Sheets</button>
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
                <button onClick={handleContinueClick} className="p-3 bg-neutral-200 rounded">Continue</button>
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
      <div className="h-20 flex items-center gap-4 justify-center text-2xl mb-1">
        <button className="rounded-full bg-neutral-200 h-16 w-16">漢字</button>
        <button className="rounded-full bg-neutral-200 h-16 w-16 flex items-center justify-center text-4xl"><RxLetterCaseCapitalize /></button>
        <button className="rounded-full bg-neutral-200 h-16 w-16 flex items-center justify-center"><FaAnglesLeft /></button>
        <button className="rounded-full bg-neutral-200 h-16 w-16 font-bold">EN</button>
        <button className="rounded-full bg-neutral-200 h-16 w-16 flex items-center justify-center"><FaHashtag/></button>
      </div>
      <div className="h-16 flex items-center pl-4 pr-4 bg-green-500 justify-center">
        <div className="text-white text-3xl font-bold">NEXT</div>
      </div>
    </div>
  )
}

export default App;
