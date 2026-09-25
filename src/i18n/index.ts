import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import itTranslations from './locales/it.json';

export const SUPPORTED_LANGUAGES = ['it', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    // No fixed `lng`: the detector picks the saved choice (localStorage) or the
    // browser language, so the whole app always renders in a single language.
    fallbackLng: 'it',
    supportedLngs: SUPPORTED_LANGUAGES,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: enTranslations,
      },
      it: {
        translation: itTranslations,
      },
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

const syncDocumentLanguage = (language: string) => {
  document.documentElement.lang = language;
};
syncDocumentLanguage(i18n.resolvedLanguage || 'it');
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
