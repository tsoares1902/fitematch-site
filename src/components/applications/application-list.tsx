'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, BriefcaseBusiness, CircleCheckBig, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useApplications } from '@/hooks/use-applications';
import { ApplicationCard } from './application-card';
import { Alert } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { PaginationBox } from '@/components/ui/pagination-box';
import { Skeleton } from '@/components/ui/skeleton';
import ApplyEntity, { ApplicationStatusEnum } from '@/types/entities/apply.entity';

function SummaryCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-7 backdrop-blur transition-all duration-300 hover:border-lime-500/20 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.05),0_18px_60px_rgba(0,0,0,0.28)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
          {icon}
        </div>
        <span className="text-xs uppercase tracking-[0.22em] text-zinc-600">{label}</span>
      </div>
      <p className="mt-7 text-5xl font-semibold tracking-[-0.06em] text-lime-400">{value}</p>
      <p className="mt-3 text-base font-medium leading-6 text-zinc-100">{helper}</p>
    </motion.div>
  );
}

export function ApplicationList() {
  const t = useTranslations('Applications');
  const { applications, isLoading, error, refetch } = useApplications();
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const stats = useMemo(() => {
    const total = applications.length;
    const active = applications.filter(
      (application) => application.status === ApplicationStatusEnum.APPLIED,
    ).length;
    const shortlisted = applications.filter(
      (application) => application.status === ApplicationStatusEnum.SHORTLISTED,
    ).length;
    const hired = applications.filter(
      (application) => application.status === ApplicationStatusEnum.HIRED,
    ).length;
    const rejected = applications.filter(
      (application) => application.status === ApplicationStatusEnum.REJECTED,
    ).length;

    return { total, active, shortlisted, hired, rejected };
  }, [applications]);

  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;
  const paginatedApplications = applications.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-44 rounded-2xl border border-zinc-800 bg-zinc-950/80"
            />
          ))
        ) : (
          <>
            <SummaryCard
              label={t('applications')}
              value={String(stats.total)}
              helper={t('totalSoFar')}
              icon={<BriefcaseBusiness className="h-4 w-4" />}
            />
            <SummaryCard
              label={t('active')}
              value={String(stats.active)}
              helper={t('currently')}
              icon={<Activity className="h-4 w-4" />}
            />
            <SummaryCard
              label={t('preApprovals')}
              value={String(stats.shortlisted)}
              helper={t('soFar')}
              icon={<CircleCheckBig className="h-4 w-4" />}
            />
            <SummaryCard
              label={t('closed')}
              value={String(stats.rejected)}
              helper={t('soFar')}
              icon={<XCircle className="h-4 w-4" />}
            />
          </>
        )}
      </section>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-64 rounded-2xl border border-zinc-800 bg-zinc-950/80"
            />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur">
          <EmptyState message={t('empty')} />
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {paginatedApplications.map((application: ApplyEntity, index) => (
              <ApplicationCard
                key={
                  application._id ||
                  `${application.jobId}-${application.userId}-${application.createdAt || application.updatedAt || 'application'}`
                }
                application={application}
                index={index}
                onDeleted={refetch}
              />
            ))}
          </div>

          <PaginationBox currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
