import { CorpusItem } from "../state/corpusState.ts";
import { itemTag, ItemTag } from "../logic/tags.ts";
import { AbstractSource } from "./AbstractSource.ts";
import { performGoogleOperation } from "../logic/util.ts";

export class SheetsSource extends AbstractSource {
  public async loadCorpus(): Promise<CorpusItem[]> {
    // Loop rows, collecting corpus items.
    const items: CorpusItem[] = [];
    for (const sheetName of this.config.sheetNames) {
      const valuesResponse = await performGoogleOperation(
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

  public getSheetNames() {
    return this.config.sheetNames;
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
      target: this.segmentTarget(targetSource),
      romanization: this.segmentRomanization(romanizationSource),
      native: nativeSource ? [nativeSource] : [],
      tags,
    });
  }

  private segmentTarget(targetSource: string): string[] {
    if (!targetSource) return [];
    const granularity = this.config.locale.includes("zh") ? "grapheme" : "word";
    const segmenter = new Intl.Segmenter(this.config.locale, { granularity });
    return Array.from(segmenter.segment(targetSource))
      .map((s) => s.segment)
      .filter((s) => s !== " ");
  }

  private segmentRomanization(romanizationSource: string): string[] {
    if (!romanizationSource) return [];
    return romanizationSource?.split(/\s+/) || [];
  }
}
