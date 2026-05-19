export const locales = ['pt', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, { label: string; flag: string; htmlLang: string }> = {
  pt: { label: 'Português', flag: '🇧🇷', htmlLang: 'pt-BR' },
  en: { label: 'English', flag: '🇺🇸', htmlLang: 'en' },
  es: { label: 'Español', flag: '🇪🇸', htmlLang: 'es' },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
