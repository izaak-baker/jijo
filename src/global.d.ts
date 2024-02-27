/* eslint-disable */
interface Window {
  googleLogin(): Promise<void>;
  googleLogout(): void;
  getGoogleSpreadsheet(spreadsheetId: string): Promise<any>;
  getSpreadsheetValues(spreadsheetId: string, range: string): Promise<any>;
  trySetupClientFromStorage(): boolean;
}