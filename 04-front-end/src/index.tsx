import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './common/reportWebVitals';
import Application from './components/Application/Application';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>
);

reportWebVitals(console.log);
