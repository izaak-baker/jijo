import {useCallback, useState} from "react";

const Configure = () => {
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
    <div className="p-4">
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
  )
}

export default Configure;