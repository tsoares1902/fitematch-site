'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { SectionLoading } from '@/components/ui/section-loading';
import { usePublicCompanies } from '@/hooks/use-public-companies';
import { getUniqueCompaniesByBrand } from '@/utils/company-brand';
import { resolveFileUrl } from '@/utils/file-url';

const VISIBLE_COMPANIES = 6;
const ROTATION_INTERVAL_MS = 35000;
const ROTATION_SWAP_MS = 520;
const ROTATION_OVERLAY_MS = 980;

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
    if (isLoading || uniqueCompanies.length <= VISIBLE_COMPANIES) {
      return;
    }

    let swapTimeout: number | undefined;
    let doneTimeout: number | undefined;

    const interval = window.setInterval(() => {
      setIsTransitioning(true);
      swapTimeout = window.setTimeout(() => {
        setStartIndex((currentIndex) => (currentIndex + 1) % uniqueCompanies.length);
      }, ROTATION_SWAP_MS);
      doneTimeout = window.setTimeout(() => setIsTransitioning(false), ROTATION_OVERLAY_MS);
    }, ROTATION_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
      if (swapTimeout) {
        window.clearTimeout(swapTimeout);
      }
      if (doneTimeout) {
        window.clearTimeout(doneTimeout);
      }
    };
  }, [isLoading, uniqueCompanies.length]);

  if (!isLoading && !error && uniqueCompanies.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-zinc-900 bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.26em] text-lime-400">
          {t('partnerCompanies')}
        </p>

        <div className="mt-12 min-h-[20rem] sm:min-h-[13rem] lg:min-h-[7rem]">
          <AnimatePresence mode="wait">
            {isLoading && (
              <SectionLoading
                key="partner-companies-loading"
                label={t('loadingStats')}
                className="min-h-[20rem] sm:min-h-[13rem] lg:min-h-[7rem]"
              />
            )}
          </AnimatePresence>

          {!isLoading && !error && (
            <AnimatePresence initial={false}>
              <motion.div
                initial={{ opacity: 0, y: 10, filter: 'brightness(0.72)' }}
                animate={{ opacity: 1, y: 0, filter: 'brightness(1)' }}
                transition={{ duration: 0.42, ease: 'easeInOut' }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6"
              >
                {visibleCompanies.map((company, index) => (
                  <div
                    key={`partner-company-slot-${index}`}
                    className="relative flex h-24 items-center justify-center overflow-hidden rounded-2xl border border-white/80 bg-white px-5 shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition-colors duration-300 hover:border-lime-300/70 hover:shadow-[0_18px_46px_rgba(0,0,0,0.24),0_0_24px_rgba(132,204,22,0.10)]"
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
                    <AnimatePresence>
                      {isTransitioning && (
                        <motion.div
                          initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
                          animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
                          exit={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
                          transition={{
                            duration: 0.32,
                            delay: index * 0.035,
                            ease: 'easeInOut',
                          }}
                          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white"
                        >
                          <div className="h-9 w-28 animate-pulse rounded-full bg-zinc-200" />
                        </motion.div>
                      )}
                    </AnimatePresence>
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
