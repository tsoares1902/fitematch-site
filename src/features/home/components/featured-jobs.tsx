'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, Building2, MapPin, Users, Wallet } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { ROUTES } from '@/constants/routes';
import { useJobs } from '@/hooks/use-jobs';
import { SectionLoading } from '@/components/ui/section-loading';
import { Link } from '@/i18n/navigation';
import { resolveFileUrl } from '@/utils/file-url';
import { getJobContractTypeLabel } from '@/utils/job-contract-label';

const VISIBLE_JOBS = 3;
const ROTATION_INTERVAL_MS = 40000;
const ROTATION_SWAP_MS = 460;
const ROTATION_OVERLAY_MS = 900;

export function FeaturedJobs() {
  const { jobs, isLoading, error } = useJobs();
  const locale = useLocale();
  const t = useTranslations('Home');
  const jobsT = useTranslations('Jobs');
  const [startIndex, setStartIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const effectiveStartIndex = jobs.length > VISIBLE_JOBS ? startIndex % jobs.length : 0;
  const featuredJobs = useMemo(() => {
    const rotatedJobs = [...jobs.slice(effectiveStartIndex), ...jobs.slice(0, effectiveStartIndex)];

    return rotatedJobs.slice(0, VISIBLE_JOBS);
  }, [effectiveStartIndex, jobs]);

  useEffect(() => {
    if (jobs.length <= VISIBLE_JOBS) {
      return;
    }

    let swapTimeout: number | undefined;
    let doneTimeout: number | undefined;

    const interval = window.setInterval(() => {
      setIsTransitioning(true);
      swapTimeout = window.setTimeout(() => {
        setStartIndex((currentIndex) => (currentIndex + 1) % jobs.length);
      }, ROTATION_SWAP_MS);
      doneTimeout = window.setTimeout(() => {
        setIsTransitioning(false);
      }, ROTATION_OVERLAY_MS);
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
  }, [jobs.length]);

  const formatSalary = (salary?: number | string) => {
    if (typeof salary === 'number') {
      return new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : locale, {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
      }).format(salary);
    }

    return salary || t('salaryToAgree');
  };

  const formatSlots = (slots?: number) => {
    if (!slots || slots <= 1) {
      return t('oneSlot');
    }

    return t('slots', { count: slots });
  };

  return (
    <section className="border-t border-zinc-900 bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.26em] text-lime-400">
              {t('featuredJobs')}
            </p>
          </div>

          <Link
            href={ROUTES.JOBS}
            className="inline-flex items-center gap-2 rounded-xl border border-lime-500/20 bg-lime-500/10 px-4 py-2.5 text-sm font-medium text-lime-300 transition-all hover:-translate-y-0.5 hover:border-lime-500/35 hover:bg-lime-500/15 hover:text-lime-200"
          >
            {t('viewAllJobs')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 min-h-72">
          <AnimatePresence mode="wait">
            {isLoading && (
              <SectionLoading
                key="featured-jobs-loading"
                label={t('loadingStats')}
                className="min-h-72"
              />
            )}
          </AnimatePresence>

          {!isLoading && !error && (
            <AnimatePresence initial={false}>
              <motion.div
                initial={{ opacity: 0, y: 12, filter: 'brightness(0.72)' }}
                animate={{ opacity: 1, y: 0, filter: 'brightness(1)' }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="grid gap-6 xl:grid-cols-3"
              >
                {featuredJobs.map((job, index) => {
                  const contractTypeLabel = getJobContractTypeLabel(job.contractType, jobsT);

                  return (
                    <article
                      key={`featured-job-slot-${index}`}
                      className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur transition-colors duration-300 hover:border-lime-500/30 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.08),0_20px_60px_rgba(0,0,0,0.32),0_0_30px_rgba(34,197,94,0.08)]"
                    >
                      <div className="relative h-44 bg-[radial-gradient(circle_at_top,rgba(199,245,29,0.16),transparent_48%),linear-gradient(180deg,rgba(24,24,27,0.7),rgba(9,9,11,0.95))]">
                        {job.media?.coverUrl && (
                          <Image
                            src={resolveFileUrl(job.media.coverUrl)}
                            alt={job.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-lime-500/20 bg-black/70 px-3 py-1.5 text-xs font-medium text-lime-300 backdrop-blur">
                          <Wallet className="h-3.5 w-3.5" />
                          {formatSalary(job.benefits?.salary)}
                        </div>

                        {contractTypeLabel && (
                          <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-black/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-zinc-200 backdrop-blur">
                            <BriefcaseBusiness className="h-3.5 w-3.5 text-lime-400" />
                            {contractTypeLabel}
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 w-full px-6 pb-5 pt-12">
                          <h3 className="text-xl font-semibold text-zinc-50">{job.title}</h3>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                            <span className="inline-flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-lime-400" />
                              {job.company.tradeName}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-lime-400" />
                              {job.company.contacts?.address?.city || t('fallbackCountry')}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <Users className="h-4 w-4 text-lime-400" />
                              {formatSlots(job.slots)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <AnimatePresence>
                        {isTransitioning && (
                          <motion.div
                            initial={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }}
                            animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
                            exit={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                            transition={{
                              duration: 0.34,
                              delay: index * 0.045,
                              ease: 'easeInOut',
                            }}
                            className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end bg-black p-5"
                          >
                            <div className="absolute inset-x-0 top-0 h-44 bg-zinc-950">
                              <div className="absolute left-4 top-4 h-7 w-24 animate-pulse rounded-full bg-zinc-800" />
                              <div className="absolute right-4 top-4 h-7 w-28 animate-pulse rounded-full bg-zinc-800" />
                            </div>
                            <div className="relative space-y-3">
                              <div className="h-5 w-3/4 animate-pulse rounded-full bg-zinc-800" />
                              <div className="flex gap-2">
                                <div className="h-4 w-24 animate-pulse rounded-full bg-zinc-800" />
                                <div className="h-4 w-20 animate-pulse rounded-full bg-zinc-800" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </article>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {!isLoading && error && (
          <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
