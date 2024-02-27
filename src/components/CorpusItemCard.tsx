import {CorpusItem} from "../state/corpusState.ts";
import {FC} from "react";

type Props = {
  item: CorpusItem;
};

const CorpusItemCard: FC<Props> = ({ item }) => {
  return <div>{item.target.join("")}</div>;
}

export default CorpusItemCard;