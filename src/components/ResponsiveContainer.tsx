import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ResponsiveContainer: FC<Props> = ({ children }) => {
  return <div className="sm:max-w-4xl sm:ml-auto sm:mr-auto">{children}</div>;
};

export default ResponsiveContainer;
