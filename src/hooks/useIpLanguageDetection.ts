
import { useEffect } from 'react';
import { Language } from '@/utils/translations';
import { useLanguage } from './useLanguage';

interface GeoResponse {
  country_code: string;
}

const countryToLanguage: Record<string, Language> = {
  // English speaking countries
  'US': 'en', 'GB': 'en', 'AU': 'en', 'CA': 'en', 'NZ': 'en',
  
  // Portuguese speaking countries
  'BR': 'pt', 'PT': 'pt', 'AO': 'pt', 'MZ': 'pt',
  
  // Spanish speaking countries
  'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'PE': 'es', 'VE': 'es', 'CL': 'es',
  
  // Italian speaking countries
  'IT': 'it', 'CH': 'it',
  
  // German speaking countries
  'DE': 'de', 'AT': 'de', 'CH': 'de',
  
  // French speaking countries
  'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'CA': 'fr', 'LU': 'fr',
  
  // Russian speaking countries
  'RU': 'ru', 'BY': 'ru', 'KZ': 'ru',
  
  // Chinese speaking countries/regions
  'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'SG': 'zh',
  
  // Japanese speaking countries
  'JP': 'ja',
  
  // Indonesian speaking countries
  'ID': 'id'
};

export function useIpLanguageDetection() {
  const { setLanguage } = useLanguage();
  
  useEffect(() => {
    // Only run the detection if no language preference is stored
    if (!localStorage.getItem('timecanvas-language')) {
      // Fetch IP info to determine country
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then((response: GeoResponse) => {
          const countryCode = response.country_code;
          const detectedLanguage = countryToLanguage[countryCode];
          
          // Only set language if we have a mapping for this country
          if (detectedLanguage) {
            setLanguage(detectedLanguage);
          }
        })
        .catch(error => {
          console.error('Error detecting country by IP:', error);
        });
    }
  }, [setLanguage]);
}
