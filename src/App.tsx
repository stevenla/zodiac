import React from 'react';
import { Board } from './Board';
import { Job } from './types';

const App: React.FC = () => {
  return (
    <div>
      <Board job={Job.Archer} />
    </div>
  );
};

export default App;
