import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App' // Ton site vitrine (Landing Page)
import Dashboard from './Dashboard' // Ton nouvel outil
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Route par défaut (Le site public) */}
        <Route path="/" element={<App />} />
        
        {/* Route secrète (L'outil de ton pote) */}
        <Route path="/app" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
