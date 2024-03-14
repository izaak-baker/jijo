import { FC, useMemo } from "react";

type Props = {
  index: number;
  scale: "large" | "small";
  displayTarget: boolean;
  fadeTarget?: boolean;
  displayRomanized: boolean;
  fadeRomanized?: boolean;
  targetElement: string;
  romanElement: string;
};

const Character: FC<Props> = ({
  index,
  scale,
  displayTarget,
  fadeTarget = false,
  displayRomanized,
  fadeRomanized = false,
  targetElement,
  romanElement,
}) => {
  const sizes = useMemo(
    () =>
      scale === "large"
        ? {
            target: "text-6xl",
            romanized:
              !displayTarget && displayRomanized ? "text-lg" : "text-sm",
            gap: "gap-2",
          }
        : {
            target: "text-3xl",
            romanized:
              !displayTarget && displayRomanized ? "text-sm" : "text-xs",
            gap: "",
          },
    [displayTarget, displayRomanized, scale],
  );

  return (
    <div key={index} className={`flex flex-col items-center ${sizes.gap}`}>
      <div
        className={`${sizes.target} ${!displayTarget ? "text-transparent" : ""} ${fadeTarget ? "opacity-25" : ""}`}
      >
        {targetElement}
      </div>
      <div
        className={`font-mono ${sizes.romanized} ${!displayRomanized ? "text-transparent" : ""} ${fadeRomanized ? "opacity-25" : ""}`}
      >
        {romanElement}
      </div>
    </div>
  );
};

export default Character;
