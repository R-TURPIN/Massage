import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Dashboard from './Dashboard'

// J'AI SUPPRIMÉ LA LIGNE "import './index.css'" ICI
// C'est ça qui causait l'écran blanc.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Route path="/" element={<App />} />
      <Route path="/app" element={<Dashboard />} />
    </HashRouter>
  </React.StrictMode>,
)
