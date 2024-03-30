import { AbstractSource } from "./AbstractSource.ts";
import { CorpusItem } from "../state/corpusState.ts";

export const CORPUS_ITEM_REGEX =
  /\s?(?<target>\S+)\s\((?<romanization>([a-z]+[0-9]\s?)+)\s“(?<native>[a-z\s]+)”\)/g;
export const TARGET_EXCEPTIONS = ["hea"];

export class DiarySource extends AbstractSource {
  public async loadCorpus(): Promise<CorpusItem[]> {
    const docResponse: DocResponse = await this.performGoogleOperation(
      async () => await window.getGoogleDoc(this.config.documentId),
    );
    const textRuns = [];
    for (const { paragraph } of docResponse.result.body.content) {
      if (!paragraph) continue;
      for (const { textRun } of paragraph.elements) {
        textRuns.push(textRun.content);
      }
    }
    const documentText = textRuns.join("");
    const corpusItemMatches = documentText.matchAll(CORPUS_ITEM_REGEX);
    const items: CorpusItem[] = [];
    for (const { groups } of corpusItemMatches) {
      if (
        !groups ||
        !["target", "romanization", "native"].every((k) =>
          Object.hasOwn(groups, k),
        )
      )
        continue;
      items.push({
        target: TARGET_EXCEPTIONS.includes(groups["target"])
          ? [groups["target"]]
          : groups["target"].split(""),
        romanization: groups["romanization"].split(/\s+/),
        native: [groups["native"]],
        tags: [],
      });
    }
    return items;
  }
}
