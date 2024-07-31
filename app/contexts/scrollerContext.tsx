import React, { createContext, useContext, useState } from "react";

const ScrollContext = createContext<{
  scrollProperties: any[];
  setScrollProperties: React.Dispatch<React.SetStateAction<any[]>>;
} | null>(null);

export const ScrollContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [scrollProperties, setScrollProperties] = useState<any[]>([]);

  return (
    <ScrollContext.Provider
      value={{ scrollProperties, setScrollProperties }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => useContext(ScrollContext);
