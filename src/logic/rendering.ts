import { CorpusItem } from "../state/corpusState.ts";

export function zip(item: CorpusItem) {
  const { target, romanization } = item;
  const result = [];
  for (let i = 0; i < target.length; i++) {
    const element = [target[i]];
    if (i < romanization.length) {
      element.push(romanization[i]);
    } else {
      element.push("");
    }
    result.push(element);
  }
  return result;
}
