import React from 'react';
import HomePage from './HomePage';
import { useLanguage } from './useLanguage';
import { Globe2 } from 'lucide-react';

export default function App() {
  const { t, lang, setLang } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="fixed w-full z-50 bg-white shadow-sm transition-all h-[90px] flex items-center">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logoaltiva.png" className="h-14 object-contain" alt="Altiva Inc" />
          </a>
          
          {/* Navegación Central */}
          <nav className="hidden md:flex items-center gap-2 font-medium text-sm">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="bg-[#1e3a8a] text-white px-5 py-2.5 rounded-md hover:bg-blue-800 transition-colors">
              {t('nav_home')}
            </a>
            <button 
              onClick={() => {
                document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-800 px-4 py-2 hover:text-blue-900 transition-colors"
            >
              {t('nav_services')}
            </button>
            <button 
              onClick={() => {
                document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-800 px-4 py-2 hover:text-blue-900 transition-colors"
            >
              {t('nav_contact')}
            </button>
          </nav>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')} 
              className="font-bold text-sm text-slate-800 hover:text-blue-900 flex items-center gap-1.5 transition-colors"
            >
              <Globe2 size={18} className="text-slate-600" />
              {lang === 'es' ? 'ES' : 'EN'}
            </button>
          </div>
        </div>
      </header>
      <div className="pt-[90px] flex-1">
        <HomePage />
      </div>
    </div>
  );
}