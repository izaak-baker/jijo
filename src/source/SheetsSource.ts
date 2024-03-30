import { CorpusItem } from "../state/corpusState.ts";
import { itemTag, ItemTag } from "../logic/tags.ts";
import { AbstractSource } from "./AbstractSource.ts";

export class SheetsSource extends AbstractSource {
  public async loadCorpus(): Promise<CorpusItem[]> {
    const spreadsheetResponse = await this.performGoogleOperation(
      async () => await window.getGoogleSpreadsheet(this.config.documentId),
    );

    // Find any tabs with "Vocab" in the name.
    const sheetNames = spreadsheetResponse.result.sheets
      ?.map((sheet: any) => sheet.properties.title)
      ?.filter((title: string) => title.includes("Vocab"));
    if (!sheetNames) return [];

    // Loop rows, collecting corpus items.
    const items: CorpusItem[] = [];
    for (const sheetName of sheetNames) {
      const valuesResponse = await this.performGoogleOperation(
        async () =>
          await window.getSpreadsheetValues(
            this.config.documentId,
            `${sheetName}!A:D`,
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
        if (row[3]) {
          for (const source of row[3].split(",")) {
            if (source.includes("=")) {
              const [key, value] = source.split("=");
              tags.push(itemTag(value, key));
            } else {
              tags.push(itemTag(source));
            }
          }
        }
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
}
