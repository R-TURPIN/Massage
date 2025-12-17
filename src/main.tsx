import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom' // On utilise HashRouter ici
import App from './App'
import Dashboard from './Dashboard'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        {/* Route par défaut (Le site public) */}
        <Route path="/" element={<App />} />
        
        {/* Route secrète (L'outil de ton pote) */}
        <Route path="/app" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)
