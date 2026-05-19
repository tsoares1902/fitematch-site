'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { usePublicCompanies } from '@/hooks/use-public-companies';
import { getUniqueCompaniesByBrand } from '@/utils/company-brand';
import { resolveFileUrl } from '@/utils/file-url';

const VISIBLE_COMPANIES = 6;
const ROTATION_INTERVAL_MS = 10000;
const TRANSITION_LOADING_MS = 450;

export function PartnerCompanies() {
  const { companies, error, isLoading } = usePublicCompanies();
  const t = useTranslations('Home');
  const uniqueCompanies = getUniqueCompaniesByBrand(companies);
  const [startIndex, setStartIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const effectiveStartIndex =
    uniqueCompanies.length > VISIBLE_COMPANIES ? startIndex % uniqueCompanies.length : 0;
  const visibleCompanies = useMemo(() => {
    const rotatedCompanies = [
      ...uniqueCompanies.slice(effectiveStartIndex),
      ...uniqueCompanies.slice(0, effectiveStartIndex),
    ];

    return rotatedCompanies.slice(0, VISIBLE_COMPANIES);
  }, [effectiveStartIndex, uniqueCompanies]);

  useEffect(() => {
    if (uniqueCompanies.length <= VISIBLE_COMPANIES) {
      return;
    }

    let transitionTimeout: number | undefined;

    const interval = window.setInterval(() => {
      setIsTransitioning(true);

      transitionTimeout = window.setTimeout(() => {
        setStartIndex((currentIndex) => (currentIndex + 1) % uniqueCompanies.length);
        setIsTransitioning(false);
      }, TRANSITION_LOADING_MS);
    }, ROTATION_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
      if (transitionTimeout) {
        window.clearTimeout(transitionTimeout);
      }
    };
  }, [uniqueCompanies.length]);

  if (!isLoading && !error && uniqueCompanies.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-zinc-900 bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.26em] text-lime-400">
          {t('partnerCompanies')}
        </p>

        <div className="mt-12">
          {(isLoading || isTransitioning) && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-2xl border border-zinc-200 bg-white/90"
                />
              ))}
            </div>
          )}

          {!isLoading && !isTransitioning && !error && (
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={effectiveStartIndex}
                initial={{ opacity: 0.35, filter: 'brightness(0.45)' }}
                animate={{ opacity: 1, filter: 'brightness(1)' }}
                exit={{ opacity: 0.25, filter: 'brightness(0.45)' }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6"
              >
                {visibleCompanies.map((company, index) => (
                  <div
                    key={company._id || company.slug || `${company.tradeName}-${index}`}
                    className="flex h-24 items-center justify-center rounded-2xl border border-white/80 bg-white px-5 shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition-colors duration-300 hover:border-lime-300/70 hover:shadow-[0_18px_46px_rgba(0,0,0,0.24),0_0_24px_rgba(132,204,22,0.10)]"
                  >
                    {company.media?.logoUrl ? (
                      <Image
                        src={resolveFileUrl(company.media.logoUrl)}
                        alt={company.tradeName}
                        width={144}
                        height={44}
                        unoptimized
                        className="max-h-11 max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-sm font-medium text-zinc-900">{company.tradeName}</span>
                    )}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
