import HomePage from './HomePage';
import { useLanguage } from './useLanguage';
import { ArrowLeft, ArrowRight, Globe2 } from 'lucide-react';

export default function App() {
  const { t, lang, setLang } = useLanguage();

  return (
    <div className="min-h-screen bg-[#00182a] text-white flex flex-col">
      <header className="fixed z-50 flex h-[90px] w-full items-center bg-transparent text-white">
        <div className="container mx-auto flex items-center justify-between px-5 md:px-8">
          <a href="#inicio" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex min-w-fit flex-col leading-none">
            <span className="mb-0.5 flex text-sky-500"><ArrowLeft size={21} strokeWidth={3} /><ArrowRight size={21} strokeWidth={3} /></span>
            <span className="text-[25px] font-light tracking-[0.04em] text-white md:text-[29px]">ALTIVA INC</span>
            <span className="mt-0.5 text-[10px] font-medium">CHILE</span>
          </a>
          
          {/* Navegación Central */}
          <nav className="hidden items-center gap-2 font-medium text-sm md:flex">
            <a href="#inicio" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="rounded-md bg-blue-600 px-5 py-2.5 text-white transition-colors hover:bg-blue-500">
              {t('nav_home')}
            </a>
            <button 
              onClick={() => document.getElementById('informes')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-2 text-white transition-colors hover:text-cyan-300"
            >
              {t('nav_services')}
            </button>
            <button 
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-2 text-white transition-colors hover:text-cyan-300"
            >
              {t('nav_contact')}
            </button>
          </nav>

          <div className="flex items-center gap-3 md:gap-6">
            <button onClick={() => document.getElementById('informes')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-white hover:text-cyan-300 md:hidden">{t('nav_services')}</button>
            <button onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-white hover:text-cyan-300 md:hidden">{t('nav_contact')}</button>
            <button 
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')} 
              className="flex items-center gap-1.5 text-sm font-bold text-white transition-colors hover:text-cyan-300"
            >
              <Globe2 size={21} className="text-white" />
              {lang === 'es' ? 'ES' : 'EN'}
            </button>
          </div>
        </div>
      </header>
      <div className="flex-1">
        <HomePage />
      </div>
    </div>
  );
}
