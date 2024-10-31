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
      const activeTags: Record<string, string> = {};
      for (const row of range.values) {
        this.processRow(row, items, activeTags);
      }
    }

    // Done!
    return items;
  }

  private processRow(
    row: string[],
    items: CorpusItem[],
    activeTags: Record<string, string>,
  ): void {
    if (row.length === 0) return;

    // Start by collecting any active tags
    const tags: ItemTag[] = [];
    Object.entries(activeTags).forEach(([key, value]) => {
      tags.push(itemTag(value, key));
    });

    if (row[0].includes("=")) {
      const [key, value] = row[0].split("=");
      activeTags[key] = value;
      return;
    }

    const [
      targetSource,
      romanizationSource,
      nativeSource,
      singleItemTagsSource,
    ] = row;

    if (singleItemTagsSource) {
      for (const source of singleItemTagsSource.split(",")) {
        if (source.includes("=")) {
          const [key, value] = source.split("=");
          tags.push(itemTag(value, key));
        } else {
          tags.push(itemTag(source));
        }
      }
    }

    items.push({
      target: targetSource?.split("") || [],
      romanization: romanizationSource?.split(/\s+/) || [],
      native: nativeSource ? [nativeSource] : [],
      tags,
    });
  }
}
