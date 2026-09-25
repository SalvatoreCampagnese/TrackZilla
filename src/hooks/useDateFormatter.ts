import { useTranslation } from 'react-i18next';
import { format as formatWithDateFns } from 'date-fns';
import { enUS, it } from 'date-fns/locale';

const INTL_LOCALES = { it: 'it-IT', en: 'en-US' } as const;
const DATE_FNS_LOCALES = { it, en: enUS } as const;

/**
 * Formats dates in the current UI language.
 * - formatDate: Intl-based, e.g. formatDate(value) or formatDate(value, { month: 'long' })
 * - formatPattern: date-fns pattern, e.g. formatPattern(value, 'PP')
 */
export const useDateFormatter = () => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage === 'en' ? 'en' : 'it';
  const intlLocale = INTL_LOCALES[language];
  const dateFnsLocale = DATE_FNS_LOCALES[language];

  const formatDate = (value: string | number | Date, options?: Intl.DateTimeFormatOptions) =>
    new Date(value).toLocaleDateString(intlLocale, options);

  const formatPattern = (value: string | number | Date, pattern: string) =>
    formatWithDateFns(new Date(value), pattern, { locale: dateFnsLocale });

  return { formatDate, formatPattern, intlLocale, dateFnsLocale };
};
