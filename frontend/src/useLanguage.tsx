import React, { useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react'; // <--- OJO AQUÍ: 'import type' separado
import translations from './translations.json';

type Language = 'es' | 'en';
type Translations = typeof translations.es;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('es');

  const t = (key: keyof Translations) => {
    // @ts-ignore
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage debe usarse dentro de LanguageProvider");
  return context;
};