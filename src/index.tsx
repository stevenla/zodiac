import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {createRoot} from 'react-dom/client';

import './index.css';

// ReactDOM.render(<App />, document.getElementById('root'));

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
