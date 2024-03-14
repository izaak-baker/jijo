import { FC, ReactNode } from "react";

const COLOR_PALETTE = {
  success: "green",
  info: "neutral",
  danger: "red",
};

type Props = {
  children: ReactNode;
  disposition: "success" | "info" | "danger";
} & { [key: string]: any };

const FooterButton: FC<Props> = ({ children, disposition, ...leftOver }) => {
  let bgColor;
  let fgColor;
  let txColor;
  switch (disposition) {
    case "success":
      bgColor = "bg-green-200";
      fgColor = "border-t-green-500";
      txColor = "text-green-500";
      break;
    case "info":
      bgColor = "bg-neutral-200";
      fgColor = "border-t-neutral-500";
      txColor = "text-neutral-500";
      break;
    case "danger":
      bgColor = "bg-red-200";
      fgColor = "border-t-red-500";
      txColor = "text-red-500";
      break;
  }
  return (
    <button
      className={`h-16 flex flex-1 items-center pl-4 pr-4 ${bgColor} ${fgColor} border-t-8 justify-center grow`}
      {...leftOver}
    >
      <div className={`${txColor} text-2xl font-bold`}>{children}</div>
    </button>
  );
};

export default FooterButton;
