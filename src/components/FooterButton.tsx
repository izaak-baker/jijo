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
  const color = COLOR_PALETTE[disposition];
  return (
    <button
      className={`h-16 flex flex-1 items-center pl-4 pr-4 bg-${color}-200 border-t-${color}-500 border-t-8 justify-center grow`}
      {...leftOver}
    >
      <div className={`text-${color}-500 text-2xl font-bold`}>{children}</div>
    </button>
  );
};

export default FooterButton;
