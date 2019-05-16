import React from 'react';
import {Board} from './Board';
import {Job} from './types';
import {StyleSheet} from './styles';
import {HighlightProvider} from './HighlightContext';
import {Character} from './Character';

const App: React.FC = () => {
  return (
    <HighlightProvider>
      <div style={styles.app}>
        <Character name="Vaan" />
      </div>
    </HighlightProvider>
  );
};

export default App;

const styles: StyleSheet = {
  app: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
    padding: 8,
  },
};
