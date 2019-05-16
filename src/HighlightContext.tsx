import React from 'react';
import {LicenseId} from './License';

interface HighlightContextType {
  highlighting: null | LicenseId;
  setHighlighting: (id: null | LicenseId) => any;
}
export const HighlightContext = React.createContext<HighlightContextType>({
  highlighting: null,
  setHighlighting: () => {},
});

interface HighlightProviderProps {
  children: React.ReactNode;
}
export const HighlightProvider: React.FC<HighlightProviderProps> = ({
  children,
}) => {
  const [highlighting, setHighlighting] = React.useState<null | LicenseId>(
    null,
  );
  return (
    <HighlightContext.Provider value={{highlighting, setHighlighting}}>
      {children}
    </HighlightContext.Provider>
  );
};