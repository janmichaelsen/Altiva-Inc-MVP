import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LanguageProvider } from './useLanguage'; // Importamos el proveedor

const GOOGLE_CLIENT_ID = "55062076132-rmsbo51r1oht9ls3tt5s847tqfmc1es2.apps.googleusercontent.com"; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* Envolvemos la App con el idioma */}
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)