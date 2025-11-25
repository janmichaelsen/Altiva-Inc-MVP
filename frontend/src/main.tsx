import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

//proveedor de Google
import { GoogleOAuthProvider } from '@react-oauth/google';


const GOOGLE_CLIENT_ID = "55062076132-rmsbo51r1oht9ls3tt5s847tqfmc1es2.apps.googleusercontent.com" ; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Envolvemos toda la app con el proveedor de Google */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
