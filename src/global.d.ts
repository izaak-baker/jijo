/* eslint-disable */
interface Window {
  googleLogin(): Promise<void>;
  googleLogout(): void;
  setGapiClientToken(token: string): void;
  gapiClientHasToken(): boolean;
  getStoredGapiClientToken(): string;
  getGoogleSpreadsheet(spreadsheetId: string): Promise<any>;
  getSpreadsheetValues(spreadsheetId: string, range: string): Promise<any>;
}