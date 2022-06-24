import React, {createContext, StrictMode, useCallback, useMemo} from 'react';
import {StyleSheet} from './styles';
import {Character} from './Character';
import {LicenseId} from './License';
import useStoredState from './useStoredState';

interface EsperContextType {
  usedEspers: Map<LicenseId, string>;
  addEsper: (id: LicenseId, name: string) => any;
  removeEsper: (id: LicenseId) => any;
}
const DEFAULT_ESPER_CONTEXT: EsperContextType = {
  usedEspers: new Map(),
  addEsper: () => {},
  removeEsper: () => {},
};
export const EsperContext = createContext<EsperContextType>(
  DEFAULT_ESPER_CONTEXT,
);

const EsperProvider = ({children}: {children: React.ReactNode}) => {
  const [usedEspers, setUsedEspers] = useStoredState<Map<LicenseId, string>>(
    'espers',
    'all',
    (map) => JSON.stringify(Array.from(map)),
    (str) => new Map(JSON.parse(str)),
  );
  const addEsper = useCallback(
    (id: LicenseId, name: string) => {
      const newMap = new Map(usedEspers || new Map());
      newMap.set(id, name);
      setUsedEspers(newMap);
    },
    [usedEspers, setUsedEspers],
  );
  const removeEsper = useCallback(
    (id: LicenseId) => {
      const newMap = new Map(usedEspers || new Map());
      newMap.delete(id);
      setUsedEspers(newMap);
    },
    [usedEspers, setUsedEspers],
  );
  const value: EsperContextType = useMemo(
    () => ({usedEspers: usedEspers || new Map(), addEsper, removeEsper}),
    [usedEspers, addEsper, removeEsper],
  );
  return (
    <EsperContext.Provider value={value}>{children}</EsperContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <StrictMode>
      <EsperProvider>
        <div style={styles.app}>
          <Character name="Vaan" />
          <Character name="Balthier" />
          <Character name="Fran" />
          <Character name="Basch" />
          <Character name="Ashe" />
          <Character name="Penelo" />
        </div>
      </EsperProvider>
    </StrictMode>
  );
};

export default App;

const styles: StyleSheet = {
  app: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
    padding: 8,
  },
};
