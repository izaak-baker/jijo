/* eslint-disable */
interface Window {
  googleLogin(): Promise<void>;
  getGoogleSpreadsheet(spreadsheetId: string): Promise<any>;
}