
import { createContext, useContext, useState, ReactNode } from "react";
import translations, { Language } from "@/utils/translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const browserLanguage = navigator.language.split("-")[0] as Language;
  const validLanguage = ["pt", "en", "es", "it", "de"].includes(browserLanguage) ? browserLanguage : "en";
  
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("timecanvas-language") as Language) || validLanguage
  );

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key];
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
