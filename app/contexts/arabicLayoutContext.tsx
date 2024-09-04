import React, { createContext, useContext, useState } from "react";

interface LayoutProperties {
  className?: string;
  style?: React.CSSProperties;
}

const LayoutContext = createContext<{
  layoutProperties: LayoutProperties;
  setLayoutProperties: React.Dispatch<React.SetStateAction<LayoutProperties>>;
} | null>(null);

export const LayoutContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [layoutProperties, setLayoutProperties] = useState<LayoutProperties>(
    {}
  );

  return (
    <LayoutContext.Provider
      value={{ layoutProperties, setLayoutProperties }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => useContext(LayoutContext);
