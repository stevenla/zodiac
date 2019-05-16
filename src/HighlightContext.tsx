import React, {useState, useContext, useEffect} from 'react';
import {LicenseId} from './License';

type HighlightListener = (ids: Set<LicenseId>) => boolean;

class HighlightStore {
  private highlightedIds: Set<LicenseId> = new Set();
  private listeners: Set<HighlightListener> = new Set();
  addListener = (listener: HighlightListener) => {
    this.listeners.add(listener);
  };
  removeListener = (listener: HighlightListener) => {
    this.listeners.delete(listener);
  };
  private triggerListeners() {
    for (const listener of this.listeners) {
      listener(this.highlightedIds);
    }
  }
  addHighlight = (id: LicenseId) => {
    if (!this.highlightedIds.has(id)) {
      this.highlightedIds.add(id);
      this.triggerListeners();
    }
  };
  removeHighlight = (id: LicenseId) => {
    if (this.highlightedIds.has(id)) {
      this.highlightedIds.delete(id);
      this.triggerListeners();
    }
  };
}

export const HighlightContext = React.createContext<HighlightStore>(
  new HighlightStore(),
);

interface HighlightProviderProps {
  children: React.ReactNode;
}
export const HighlightProvider: React.FC<HighlightProviderProps> = ({
  children,
}) => {
  const [store] = React.useState(() => new HighlightStore());
  return (
    <HighlightContext.Provider value={store}>
      {children}
    </HighlightContext.Provider>
  );
};

export function useHighlight(
  isHighlighting: HighlightListener,
): [boolean, (id: LicenseId) => void, (id: LicenseId) => void] {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const store = useContext(HighlightContext);
  useEffect(() => {
    let lastHighlighted = isHighlighted;
    const listener: HighlightListener = ids => {
      const is = isHighlighting(ids);
      if (is !== lastHighlighted) {
        setIsHighlighted(is);
        lastHighlighted = is;
      }
      return is;
    };
    store.addListener(listener);
    return () => store.removeListener(listener);
  }, [isHighlighting]);
  return [isHighlighted, store.addHighlight, store.removeHighlight];
}
