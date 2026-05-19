'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { localeLabels, locales, type Locale } from '@/i18n/config';

export function LanguageDropdown({ isFullWidth = false }: { isFullWidth?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Language');
  const selectedLanguage = localeLabels[locale];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  const buttonClassName = `inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-4 py-2 text-sm font-medium text-zinc-200 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-50 ${
    isFullWidth ? 'w-full justify-between' : ''
  }`;

  return (
    <div ref={containerRef} className={isFullWidth ? 'relative w-full' : 'relative'}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={buttonClassName}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span>{selectedLanguage.flag}</span>
          <span className="truncate">{selectedLanguage.label}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            role="listbox"
            aria-label={t('select')}
            className={`absolute z-50 mt-3 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur ${
              isFullWidth ? 'left-0 right-0' : 'right-0 w-72'
            }`}
          >
            <div className="border-b border-zinc-800 px-3 py-3">
              <p className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                <span>{selectedLanguage.flag}</span>
                <span>{selectedLanguage.label}</span>
              </p>
              <p className="mt-1 text-xs text-zinc-500">{t('choose')}</p>
            </div>

            <div className="py-2">
              {locales.map((language) => {
                const languageDetails = localeLabels[language];
                const isSelected = language === locale;

                return (
                  <button
                    key={language}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setIsOpen(false);
                      router.replace(pathname, { locale: language });
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors ${
                      isSelected
                        ? 'bg-lime-500/10 text-lime-300'
                        : 'text-zinc-300 hover:bg-white/[0.03] hover:text-zinc-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{languageDetails.flag}</span>
                      <span>{t(language)}</span>
                    </span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
