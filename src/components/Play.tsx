import CircleButton from "./CircleButton.tsx";
import {RxLetterCaseCapitalize} from "react-icons/rx";
import {FaAnglesLeft, FaHashtag} from "react-icons/fa6";
import {useDisplayStore} from "../state.ts";

const Play = () => {

  const display = useDisplayStore((state) => state.display);
  const toggleDisplay = useDisplayStore((state) => state.toggleDisplay);

  return (
    <div className="flex flex-col items-stretch h-full">
      <div className="grow p-4 flex flex-col items-center justify-center">
        <div className="flex flex-col gap-4 items-center">
          <div className="text-8xl font-bold text-neutral-300">
            自助
          </div>
          <div className="text-lg text-neutral-500">
            No vocabulary configured.
          </div>
        </div>
      </div>
      <div className="h-20 flex items-center gap-2 justify-center text-2xl mb-1">
        <CircleButton active={display.target} onClick={() => toggleDisplay('target')}>
          漢字
        </CircleButton>
        <CircleButton active={display.romanized} onClick={() => toggleDisplay('romanized')}>
          <span className="text-4xl"><RxLetterCaseCapitalize/></span>
        </CircleButton>
        <CircleButton active={display.target || display.romanized}>
          <FaAnglesLeft/>
        </CircleButton>
        <CircleButton active={display.native} onClick={() => toggleDisplay('native')}>
          <span className="font-bold">EN</span>
        </CircleButton>
        <CircleButton active={display.tags} onClick={() => toggleDisplay('tags')}>
          <FaHashtag/>
        </CircleButton>
      </div>
      <div className="h-16 flex items-center pl-4 pr-4 bg-violet-500 justify-center">
        <div className="text-white text-2xl font-bold">NEXT</div>
      </div>
    </div>
  );
};

export default Play;