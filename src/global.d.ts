type SpreadsheetResponse = {
  result: {
    sheets: {
      properties: {
        title: string;
      }
    }[];
  }
}

type SpreadsheetValuesResponse = {
  result: {
    values: string[][];
  }
}

interface Window {
  googleLogin(): Promise<void>;
  googleLogout(): void;
  setGapiClientToken(token: string): void;
  gapiClientHasToken(): boolean;
  getStoredGapiClientToken(): string;
  getGoogleSpreadsheet(spreadsheetId: string): Promise<SpreadsheetResponse>;
  getSpreadsheetValues(spreadsheetId: string, range: string): Promise<SpreadsheetValuesResponse>;
}