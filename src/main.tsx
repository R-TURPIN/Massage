import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// J'ai supprimé la ligne "import './index.css'" ici car le fichier n'existe pas
// et que Tailwind est chargé via le fichier index.html

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
