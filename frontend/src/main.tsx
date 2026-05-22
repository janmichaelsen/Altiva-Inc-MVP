import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './useLanguage'; // Importamos el proveedor

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Envolvemos la App con el idioma */}
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
)