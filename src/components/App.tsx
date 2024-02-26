import {useCallback, useState} from "react";
import {FaGear, FaDatabase, FaPlay, FaHashtag, FaAnglesLeft, FaCircleQuestion} from "react-icons/fa6";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import CircleButton from "./CircleButton.tsx";
import {useDisplayStore} from "../state.ts";


const ICON_SIZE = 24;

const App = () => {
  const [googleLoggedIn, setGoogleLoggedIn] = useState<boolean>(false);
  const [googleSpreadsheetId, setGoogleSpreadsheetId] = useState<string>();
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const display = useDisplayStore((state) => state.display);
  const toggleDisplay = useDisplayStore((state) => state.toggleDisplay);

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
      <div className="h-16 bg-neutral-800 flex items-center pl-4 pr-4 text-white">
        <div className="text-4xl pb-2 font-bold text-violet-400">jijo</div>
        <div className="top-menu ml-auto flex gap-4">
          <FaPlay size={ICON_SIZE} />
          <FaGear size={ICON_SIZE} />
          <FaDatabase size={ICON_SIZE} />
          <FaCircleQuestion size={ICON_SIZE} />
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
      <div className="h-20 flex items-center gap-2 justify-center text-2xl mb-1">
        <CircleButton active={display.target} onClick={() => toggleDisplay('target')}>
          <span className="jj-han">漢字</span>
        </CircleButton>
        <CircleButton active={display.romanized} onClick={() => toggleDisplay('romanized')}>
          <span className="text-4xl"><RxLetterCaseCapitalize /></span>
        </CircleButton>
        <CircleButton active={display.target || display.romanized}>
          <FaAnglesLeft />
        </CircleButton>
        <CircleButton active={display.native} onClick={() => toggleDisplay('native')}>
          <span className="font-bold">EN</span>
        </CircleButton>
        <CircleButton active={display.tags} onClick={() => toggleDisplay('tags')}>
          <FaHashtag />
        </CircleButton>
      </div>
      <div className="h-16 flex items-center pl-4 pr-4 bg-violet-500 justify-center">
        <div className="text-white text-2xl font-bold">NEXT</div>
      </div>
    </div>
  )
}

export default App;
