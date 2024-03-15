import { CorpusItem } from "../state/corpusState.ts";
import { itemTag, ItemTag } from "../utils/tags.ts";
import { SheetsSourceConfig } from "../utils/rxdb.ts";

export class SheetsSource {
  constructor(private config: SheetsSourceConfig) {}

  public getName() {
    return this.config.name;
  }

  public getId() {
    return this.config.id;
  }

  async loadCorpus(): Promise<CorpusItem[]> {
    const spreadsheetResponse = await this.performSheetsOperation(
      async () => await window.getGoogleSpreadsheet(this.config.spreadsheetId),
    );

    // Find any tabs with "Vocab" in the name.
    const sheetNames = spreadsheetResponse?.result?.sheets
      ?.map((sheet: any) => sheet.properties.title)
      ?.filter((title: string) => title.includes("Vocab"));
    if (!sheetNames) return [];

    // Loop rows, collecting corpus items.
    const items: CorpusItem[] = [];
    for (const sheetName of sheetNames) {
      const valuesResponse = await this.performSheetsOperation(
        async () =>
          await window.getSpreadsheetValues(
            this.config.spreadsheetId,
            `${sheetName}!A:C`,
          ),
      );
      const range = valuesResponse.result;
      if (!range || !range.values || range.values.length === 0) {
        continue;
      }
      const activeTags: { [key: string]: string } = {};
      for (const row of range.values) {
        if (row.length === 0) continue;
        const tags: ItemTag[] = [];
        Object.entries(activeTags).forEach(([key, value]) => {
          tags.push(itemTag(value, key));
        });
        if (row[2]) {
          items.push({
            target: row[0].split(""),
            romanization: row[1].split(/\s+/),
            native: [row[2]],
            tags,
          });
        } else {
          const [key, value] = row[0].split("=");
          activeTags[key] = value;
        }
      }
    }

    // Done!
    return items;
  }

  private async performSheetsOperation<T>(operation: () => T): Promise<T> {
    if (!window.gapiClientHasToken()) {
      const storedToken = window.getStoredGapiClientToken();
      if (!storedToken) {
        await window.googleLogin();
        return this.performSheetsOperation(operation);
      }
      window.setGapiClientToken(storedToken);
    }

    let response: T;
    try {
      response = await operation();
    } catch (e) {
      console.error(e);
      window.googleLogout();
      return this.performSheetsOperation(operation);
    }

    return response;
  }
}
