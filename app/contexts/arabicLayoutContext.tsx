import React, { createContext, useContext, useState } from "react";

interface LayoutProperties {
  className?: string;
  style?: React.CSSProperties;
}

const ArabicLayoutContext = createContext<{
  layoutProperties: LayoutProperties;
  setLayoutProperties: React.Dispatch<React.SetStateAction<LayoutProperties>>;
} | null>(null);

export const ArabicLayoutContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [layoutProperties, setLayoutProperties] = useState<LayoutProperties>(
    {}
  );

  return (
    <ArabicLayoutContext.Provider
      value={{ layoutProperties, setLayoutProperties }}
    >
      {children}
    </ArabicLayoutContext.Provider>
  );
};

export const useArabicLayoutContext = () => useContext(ArabicLayoutContext);
