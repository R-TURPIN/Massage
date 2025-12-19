import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Dashboard from './Dashboard'

// Sécurité anti-crash
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-10">
          <div className="max-w-2xl bg-white p-8 rounded-xl shadow-xl border border-red-200">
            <h1 className="text-2xl font-bold text-red-600 mb-4">🚨 Erreur Système</h1>
            <p className="mb-4 text-slate-600">Une erreur technique empêche l'affichage.</p>
            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-auto text-sm font-mono">
              {this.state.error?.toString()}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/app" element={<Dashboard />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
