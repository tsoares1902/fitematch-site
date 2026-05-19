'use client';

import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { JobCard } from './job-card';
import { useJobs } from '@/hooks/use-jobs';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Alert } from '@/components/ui/alert';
import { PaginationBox } from '@/components/ui/pagination-box';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { LanguagesEnum } from '@/types/entities/job.entity';

interface JobGridProps {
  search: string;
}

export function JobGrid({ search }: JobGridProps) {
  const { jobs, isLoading, error } = useJobs();
  const breakpoint = useBreakpoint();
  const t = useTranslations('Jobs');

  const [page, setPage] = useState(1);

  let itemsPerPage = 6;
  let gridCols = 'md:grid-cols-2 lg:grid-cols-3';

  if (breakpoint === 'tablet') {
    itemsPerPage = 4;
    gridCols = 'md:grid-cols-2 lg:grid-cols-2';
  } else if (breakpoint === 'mobile') {
    itemsPerPage = 2;
    gridCols = 'md:grid-cols-1 lg:grid-cols-1';
  }

  function normalizeSearchValue(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  const getLanguageLabel = useCallback(
    (value: LanguagesEnum) =>
      ({
        [LanguagesEnum.PORTUGUESE]: t('portuguese'),
        [LanguagesEnum.ENGLISH]: t('english'),
        [LanguagesEnum.SPANISH]: t('spanish'),
      })[value],
    [t],
  );

  const filteredJobs = useMemo(() => {
    const normalizedSearch = normalizeSearchValue(search.trim());

    return jobs.filter((job) => {
      if (!normalizedSearch) {
        return true;
      }

      const companyAddress = job.company?.contacts?.address;
      const languageTerms = (job.requirements?.languages || [])
        .flatMap((language) => [language.name, getLanguageLabel(language.name)])
        .filter(Boolean);

      const searchableTerms = [
        job.title,
        job.contractType,
        companyAddress?.city,
        companyAddress?.state,
        job.company?.tradeName,
        ...languageTerms,
      ]
        .filter(Boolean)
        .map((term) => normalizeSearchValue(String(term)));

      return searchableTerms.some((term) => term.includes(normalizedSearch));
    });
  }, [getLanguageLabel, jobs, search]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;

  const startIdx = (safePage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const jobsToShow = filteredJobs.slice(startIdx, endIdx);

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className={`grid gap-6 ${gridCols}`}>
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[32rem] rounded-2xl border border-zinc-800 bg-zinc-950/80"
            />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur">
          <EmptyState message={t('empty')} />
        </div>
      ) : (
        <>
          <div className={`grid gap-6 ${gridCols}`}>
            {jobsToShow.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          <PaginationBox
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
