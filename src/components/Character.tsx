import { FC, useMemo } from "react";

type Props = {
  index: number;
  scale: "large" | "small";
  displayTarget: boolean;
  displayRomanized: boolean;
  targetElement: string;
  romanElement: string;
};

const Character: FC<Props> = ({
  index,
  scale,
  displayTarget,
  displayRomanized,
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
        className={`${sizes.target} ${!displayTarget ? "text-transparent" : ""}`}
      >
        {targetElement}
      </div>
      <div
        className={`font-mono ${sizes.romanized} ${!displayRomanized ? "text-transparent" : ""}`}
      >
        {romanElement}
      </div>
    </div>
  );
};

export default Character;
