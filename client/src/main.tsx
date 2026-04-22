import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { SelectedClubProvider } from './context/SelectedClubContext';
import { AuthProvider } from './auth/AuthContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SelectedClubProvider>
          <App />
        </SelectedClubProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);