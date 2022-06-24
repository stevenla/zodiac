/**
 * Creates a context where Licenses can be highlighted across all displayed
 * boards. We use a separate store instead of just setting state so that we
 * don't update all cells if their highlight state hasn't changed.
 */
import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import {createContext, useContextSelector} from 'use-context-selector';
import {LicenseId} from './License';

type HighlightContextType = {
  current: LicenseId | null;
  setCurrent: (newValue: LicenseId | null) => void;
};
const HighlightContext = createContext<HighlightContextType>({
  current: null,
  setCurrent: () => {},
});

type HighlightProviderProps = {children: React.ReactNode | React.ReactNode[]};
export const HighlightProvider: React.FC<HighlightProviderProps> = ({
  children,
}) => {
  const [current, setCurrent] = useState<LicenseId | null>(null);
  const ctx = useMemo<HighlightContextType>(
    () => ({current, setCurrent}),
    [current, setCurrent],
  );
  return (
    <HighlightContext.Provider value={ctx}>
      {children}
    </HighlightContext.Provider>
  );
};

export function useHighlight(
  id: LicenseId | null,
): [boolean, (newValue: boolean) => void] {
  const isHighlighting = useContextSelector(
    HighlightContext,
    (ctx) => !!id && ctx.current === id,
  );
  const setHighlighting = useContextSelector(
    HighlightContext,
    (ctx) => ctx.setCurrent,
  );
  const isHighlightingRef = useRef<boolean>(false);
  useEffect(() => {
    isHighlightingRef.current = isHighlighting;
  }, [isHighlighting]);
  const setIsHighlighting = useCallback((newValue: boolean) => {
    if (newValue) {
      setHighlighting(id);
    } else if (isHighlightingRef.current) {
      setHighlighting(null);
    }
  }, []);
  return [isHighlighting, setIsHighlighting];
}
