import { CorpusItem } from "../state/corpusState.ts";

export type RomanizedCharacter = {
  targetCharacter: string;
  romanizedCharacter: string;
};

export function zip(item: CorpusItem): RomanizedCharacter[] {
  const { target, romanization } = item;
  const result: RomanizedCharacter[] = [];
  for (let i = 0; i < Math.max(romanization.length, target.length); i++) {
    const targetCharacter = target[i];
    const romanizedCharacter = romanization[i];
    result.push({ targetCharacter, romanizedCharacter });
  }
  return result;
}
