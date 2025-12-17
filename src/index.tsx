import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Dashboard from './Dashboard';

// J'ai commenté le CSS pour l'instant pour éviter les erreurs de fichier manquant
// import './index.css'; 

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/app" element={<Dashboard />} />
        </Routes>
      </HashRouter>
    </React.StrictMode>
  );
}
