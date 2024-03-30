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

type DocResponse = {
  result: {
    title: string;
    body: {
      content: {
        paragraph?: {
          elements: {
            textRun: {
              content: string;
            }
          }[];
        }
      }[];
    }
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
  getGoogleDoc(documentId: string): Promise<DocResponse>
}