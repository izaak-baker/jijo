import {FC, ReactNode} from "react";

type Props = {
  children: ReactNode;
}

const CircleButton: FC<Props> = ({ children }) => {
  return (
    <button className="rounded-full bg-neutral-200 h-16 w-16 flex items-center justify-center">
      {children}
    </button>
  );
}

export default CircleButton;