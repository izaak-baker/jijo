import {FC, ReactNode, useMemo} from "react";

type Props = {
  children: ReactNode;
  active: boolean;
} & { [key: string]: any }

const CircleButton: FC<Props> = ({ children, active, ...leftOver }) => {
  const className = useMemo(() => `
    rounded-full ${active ? 'bg-violet-300' : 'bg-neutral-300'} h-16 w-16 flex items-center justify-center
  `, [active])
  return (
    <button {...leftOver} className={className}>
      {children}
    </button>
  );
}

export default CircleButton;