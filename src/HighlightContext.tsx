/**
 * Creates a context where Licenses can be highlighted across all displayed
 * boards. We use a separate store instead of just setting state so that we
 * don't update all cells if their highlight state hasn't changed.
 */
import React, {useState, useContext, useEffect, useMemo} from 'react';
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
  clearHighlights = () => {
    this.highlightedIds.clear();
    this.triggerListeners();
  };
}

const HighlightContext = React.createContext<HighlightStore>(
  new HighlightStore(),
);

interface HighlightProviderProps {
  children: React.ReactNode;
}

/**
 * Creates a store that can save which elements are being highlighted
 */
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

interface ContextSet {
  add(id: LicenseId): void;
  delete(id: LicenseId): void;
  clear(): void;
}

export function useHighlight(
  isHighlighting: HighlightListener,
): [boolean, ContextSet] {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const store = useContext(HighlightContext);
  const contextSet: ContextSet = useMemo(
    () => ({
      add: store.addHighlight,
      delete: store.removeHighlight,
      clear: store.clearHighlights,
    }),
    [store],
  );
  useEffect(() => {
    let lastHighlighted = false;
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
  }, [store, isHighlighting]);
  return [isHighlighted, contextSet];
}
