import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import translations, { Language } from "@/utils/translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage first
    const savedLanguage = localStorage.getItem("timecanvas-language") as Language | null;
    if (savedLanguage && isValidLanguage(savedLanguage)) {
      return savedLanguage;
    }
    
    // Otherwise, try to detect from browser
    const browserLanguage = navigator.language.split("-")[0] as Language;
    return isValidLanguage(browserLanguage) ? browserLanguage : 'en';
  });

  function isValidLanguage(lang: string): lang is Language {
    return ['en', 'pt', 'es', 'it', 'de', 'fr', 'ru', 'zh', 'ja', 'id'].includes(lang);
  }

  const t = (key: keyof typeof translations.en): string => {
    // If the translation exists in the current language, use it
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // Fallback to English
    return translations.en[key] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    localStorage.setItem("timecanvas-language", lang);
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
