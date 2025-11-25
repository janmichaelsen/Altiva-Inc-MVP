import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // <--- CONFIRMA QUE ESTE IMPORT ESTÉ AQUÍ
import CreateReport from './pages/CreateReport';
import ClientDashboard from './pages/ClientDashboard';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import { LogOut, User } from 'lucide-react';
import type { Language } from './types';

const ProtectedLayout = ({ children, role }: { children: React.ReactNode, role?: 'admin' | 'client' }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let user;
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    user = null;
  }

  if (!token || !user || !user.role) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <Link to="/" className="flex items-center cursor-pointer">
          <img src="/logoaltiva.png" alt="Altiva Logo" className="h-8 object-contain" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            <User size={14}/> 
            <span className="font-medium">{user.name}</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-red-500 hover:bg-red-50 hover:text-red-600 p-2 rounded-full transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>
      <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  const [language, setLanguage] = useState<Language>('es');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-white flex flex-col">
            <header className="fixed w-full z-50 bg-white shadow-sm transition-all h-20 flex items-center">
              <div className="container mx-auto px-6 flex items-center justify-between">
                <a href="/" className="flex items-center gap-2">
                  <img src="/logoaltiva.png" className="h-12 object-contain" alt="Altiva Inc" />
                </a>
                <nav className="hidden md:flex items-center gap-8 font-medium text-slate-700">
                  <Link to="/" className="hover:text-blue-900 transition-colors">Inicio</Link>
                  <Link to="/services" className="hover:text-blue-900 transition-colors">Servicios</Link>
                  <Link to="/contact" className="hover:text-blue-900 transition-colors">Contacto</Link>
                </nav>
                <div className="flex items-center gap-4">
                  <a 
                    href="/login" 
                    className="bg-blue-800 text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-blue-900 transition-colors shadow-sm"
                  >
                    Portal Clientes
                  </a>
                  <button 
                    onClick={() => setLanguage(l => l === 'es' ? 'en' : 'es')} 
                    className="font-bold text-sm text-slate-800 hover:text-blue-900"
                  >
                    {language === 'es' ? 'ES' : 'EN'}
                  </button>
                </div>
              </div>
            </header>
            <div className="pt-20 flex-1">
              <HomePage language={language} onNavigate={(path) => window.location.href = path} />
            </div>
          </div>
        } />
        
        <Route path="/login" element={<LoginPage />} />
        
        {/* ESTA ES LA RUTA CRÍTICA QUE FALTABA */}
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<ServicesPage />} />

        <Route path="/admin" element={<ProtectedLayout role="admin"><CreateReport onCancel={() => window.history.back()} onSuccess={() => alert('¡Reporte Asignado!')}/></ProtectedLayout>} />
        <Route path="/dashboard" element={<ProtectedLayout role="client"><ClientDashboard /></ProtectedLayout>} />
      </Routes>
    </BrowserRouter>
  );
}