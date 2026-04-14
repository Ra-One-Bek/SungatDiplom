import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { SelectedClubProvider } from './context/SelectedClubContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <SelectedClubProvider>
        <App />
      </SelectedClubProvider>
    </BrowserRouter>
  </React.StrictMode>,
);