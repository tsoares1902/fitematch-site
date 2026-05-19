'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BriefcaseBusiness, FileText, PencilLine, Trash2, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PaginationBox } from '@/components/ui/pagination-box';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { useRecruiterJobs } from '@/hooks/use-recruiter-jobs';
import { JobService } from '@/services/job/job.service';
import { JobEntity, JobStatusEnum } from '@/types/entities/job.entity';
import { Link } from '@/i18n/navigation';

type RecruiterJobsTranslator = ReturnType<typeof useTranslations>;

function getContractTypeLabel(value: string | undefined, t: RecruiterJobsTranslator) {
  const normalizedValue = value
    ?.trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
  const contractTypeMap: Record<string, string> = {
    clt: 'CLT',
    pj: 'PJ',
    freelance: 'Freelance',
    internship: t('contractInternship'),
    temporary: t('contractTemporary'),
    part_time: t('contractPartTime'),
    full_time: t('contractFullTime'),
    autonomous: t('contractAutonomous'),
  };

  if (normalizedValue && contractTypeMap[normalizedValue]) {
    return contractTypeMap[normalizedValue];
  }

  if (normalizedValue?.includes('clt')) {
    return 'CLT';
  }

  if (normalizedValue?.includes('pj')) {
    return 'PJ';
  }

  if (normalizedValue?.includes('freela') || normalizedValue?.includes('freelance')) {
    return 'Freelance';
  }

  if (normalizedValue?.includes('estag')) {
    return t('contractInternship');
  }

  if (normalizedValue?.includes('tempor')) {
    return t('contractTemporary');
  }

  if (normalizedValue?.includes('part_time') || normalizedValue?.includes('meio_periodo')) {
    return t('contractPartTime');
  }

  if (normalizedValue?.includes('full_time') || normalizedValue?.includes('tempo_integral')) {
    return t('contractFullTime');
  }

  if (normalizedValue?.includes('autonom')) {
    return t('contractAutonomous');
  }

  return value || t('notDefined');
}

function getStatusTone(status?: string) {
  if (status === JobStatusEnum.ACTIVE) {
    return 'border-lime-500/20 bg-lime-500/10 text-lime-300';
  }

  if (status === JobStatusEnum.CLOSED) {
    return 'border-red-500/20 bg-red-500/10 text-red-200';
  }

  return 'border-zinc-800 bg-black/40 text-zinc-400';
}

function getStatusLabel(status: string | undefined, t: RecruiterJobsTranslator) {
  return (
    {
      [JobStatusEnum.DRAFT]: t('statusDraft'),
      [JobStatusEnum.PENDING]: t('statusPending'),
      [JobStatusEnum.ACTIVE]: t('statusActive'),
      [JobStatusEnum.PAUSED]: t('statusPaused'),
      [JobStatusEnum.CLOSED]: t('statusClosed'),
    }[status || ''] ||
    status ||
    t('noStatus')
  );
}

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
      className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur transition-all duration-300 hover:border-lime-500/20 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.05),0_18px_60px_rgba(0,0,0,0.28)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
          {icon}
        </div>
        <span className="text-xs uppercase tracking-[0.22em] text-zinc-600">{label}</span>
      </div>
      <p className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-zinc-50">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{helper}</p>
    </motion.div>
  );
}

export function RecruiterJobsList() {
  const t = useTranslations('RecruiterJobs');
  const { jobs, isLoading, error, refetch } = useRecruiterJobs();
  const { showSuccess, showError } = useFlashMessage();
  const [jobToDelete, setJobToDelete] = useState<JobEntity | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const activeJobs = useMemo(
    () => jobs.filter((job) => job.status === JobStatusEnum.ACTIVE).length,
    [jobs],
  );
  const pendingJobs = useMemo(
    () => jobs.filter((job) => job.status === JobStatusEnum.PENDING).length,
    [jobs],
  );
  const totalSlots = useMemo(() => jobs.reduce((sum, job) => sum + (job.slots || 0), 0), [jobs]);

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;
  const paginatedJobs = jobs.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  async function handleDelete(jobId: string) {
    try {
      await JobService.deleteMine(jobId);
      showSuccess(t('deleteSuccess'));
      setJobToDelete(null);
      await refetch();
    } catch {
      showError(t('deleteError'));
    }
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-40 rounded-2xl border border-zinc-800 bg-zinc-950/80"
            />
          ))
        ) : (
          <>
            <SummaryCard
              label={t('published')}
              value={String(jobs.length)}
              helper={t('publishedHelper')}
              icon={<BriefcaseBusiness className="h-4 w-4" />}
            />
            <SummaryCard
              label={t('active')}
              value={String(activeJobs)}
              helper={t('activeHelper')}
              icon={<ArrowUpRight className="h-4 w-4" />}
            />
            <SummaryCard
              label={t('pending')}
              value={String(pendingJobs)}
              helper={t('pendingHelper')}
              icon={<FileText className="h-4 w-4" />}
            />
            <SummaryCard
              label={t('candidates')}
              value={String(totalSlots)}
              helper={t('candidatesHelper')}
              icon={<Users className="h-4 w-4" />}
            />
          </>
        )}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, delay: 0.05 }}
        className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur"
      >
        <div className="flex flex-col gap-4 border-b border-zinc-800 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="mt-1 text-xl font-semibold text-zinc-50 uppercase">
              {t('companyPublications')}
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-black/40 px-3 py-1.5 text-sm text-zinc-400">
            <BriefcaseBusiness className="h-4 w-4 text-lime-400" />
            {isLoading ? t('loadingJobs') : t('records', { count: jobs.length })}
          </div>
        </div>

        {isLoading && (
          <div className="space-y-4 p-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-48 rounded-2xl border border-zinc-800 bg-black/50"
              />
            ))}
          </div>
        )}

        {!isLoading && jobs.length === 0 && (
          <div className="p-6">
            <EmptyState message={t('empty')} />
          </div>
        )}

        {!isLoading && jobs.length > 0 && (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-zinc-800 text-left">
                <thead className="bg-black/30">
                  <tr className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    <th className="px-6 py-4 font-medium">{t('job')}</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">{t('contract')}</th>
                    <th className="px-6 py-4 font-medium">{t('jobQuantity')}</th>
                    <th className="px-6 py-4 font-medium text-right">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {paginatedJobs.map((job, index) => {
                    const jobId = job._id || (job as { id?: string }).id;

                    return (
                      <tr
                        key={jobId || job.slug || `${job.title}-${index}`}
                        className="transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-6 py-5">
                          <div>
                            <p className="text-sm font-medium text-zinc-100">{job.title}</p>
                            <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                              {job.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${getStatusTone(job.status)}`}
                          >
                            {getStatusLabel(job.status, t)}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-zinc-300">
                          {getContractTypeLabel(job.contractType, t)}
                        </td>
                        <td className="px-6 py-5 text-sm text-zinc-300">{job.slots}</td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            {jobId && (
                              <Link href={ROUTES.RECRUITER_EDIT_JOB(jobId)}>
                                <Button
                                  variant="profile"
                                  icon={<PencilLine className="h-4 w-4" />}
                                  className="rounded-xl border-zinc-800 bg-black/40 text-zinc-200 hover:bg-white/[0.03]"
                                >
                                  {t('edit')}
                                </Button>
                              </Link>
                            )}
                            {jobId && (
                              <Link href={ROUTES.RECRUITER_JOB_APPLICATIONS(jobId)}>
                                <Button
                                  variant="positive"
                                  icon={<Users className="h-4 w-4" />}
                                  className="rounded-xl border-lime-500/20 bg-lime-500/10 text-lime-300 hover:bg-lime-500/15"
                                >
                                  {t('candidates')}
                                </Button>
                              </Link>
                            )}
                            <Button
                              type="button"
                              variant="danger"
                              icon={<Trash2 className="h-4 w-4" />}
                              onClick={() => {
                                if (jobId) {
                                  setJobToDelete(job);
                                }
                              }}
                              disabled={!jobId}
                              className="rounded-xl border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
                            >
                              {t('remove')}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-6 lg:hidden">
              {paginatedJobs.map((job, index) => {
                const jobId = job._id || (job as { id?: string }).id;

                return (
                  <motion.article
                    key={jobId || job.slug || `${job.title}-${index}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, delay: index * 0.04 }}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 backdrop-blur transition-all duration-300 hover:border-lime-500/20 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.05),0_18px_60px_rgba(0,0,0,0.28)]"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-zinc-50">{job.title}</h3>
                          <p className="mt-1 text-sm text-zinc-500">{job.description}</p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] ${getStatusTone(job.status)}`}
                        >
                          {getStatusLabel(job.status, t)}
                        </span>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                            {t('contract')}
                          </p>
                          <p className="mt-2 text-sm text-zinc-200">
                            {getContractTypeLabel(job.contractType, t)}
                          </p>
                        </div>
                        <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Slots</p>
                          <p className="mt-2 text-sm text-zinc-200">{job.slots}</p>
                        </div>
                        <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Fluxo</p>
                          <p className="mt-2 text-sm text-zinc-200">{t('applicationsAndEdit')}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {jobId && (
                          <Link href={ROUTES.RECRUITER_EDIT_JOB(jobId)}>
                            <Button
                              variant="profile"
                              icon={<PencilLine className="h-4 w-4" />}
                              className="rounded-xl border-zinc-800 bg-black/40 text-zinc-200 hover:bg-white/[0.03]"
                            >
                              {t('edit')}
                            </Button>
                          </Link>
                        )}
                        {jobId && (
                          <Link href={ROUTES.RECRUITER_JOB_APPLICATIONS(jobId)}>
                            <Button
                              variant="positive"
                              icon={<Users className="h-4 w-4" />}
                              className="rounded-xl border-lime-500/20 bg-lime-500/10 text-lime-300 hover:bg-lime-500/15"
                            >
                              {t('candidates')}
                            </Button>
                          </Link>
                        )}
                        <Button
                          type="button"
                          variant="danger"
                          icon={<Trash2 className="h-4 w-4" />}
                          onClick={() => {
                            if (jobId) {
                              setJobToDelete(job);
                            }
                          }}
                          disabled={!jobId}
                          className="rounded-xl border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
                        >
                          {t('remove')}
                        </Button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="px-6 pb-6">
              <PaginationBox
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </motion.section>

      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 text-xl font-semibold uppercase text-zinc-100">
                <Trash2 className="h-5 w-5 shrink-0 text-red-300" />
                <h2>{t('deleteJob')}</h2>
              </div>
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                className="text-2xl leading-none text-zinc-400 transition-colors hover:text-zinc-100"
                aria-label={t('closeModal')}
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-zinc-300">{t('confirmDeleteDescription')}</p>

              <div className="grid gap-4 rounded-2xl border border-zinc-800 bg-black/50 p-6 md:grid-cols-2">
                <div>
                  <label className="text-sm text-zinc-400">{t('title')}</label>
                  <input
                    value={jobToDelete.title}
                    disabled
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 opacity-100"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">{t('contractType')}</label>
                  <input
                    value={getContractTypeLabel(jobToDelete.contractType, t)}
                    disabled
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 opacity-100"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Status</label>
                  <input
                    value={getStatusLabel(jobToDelete.status, t)}
                    disabled
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 opacity-100"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">{t('jobs')}</label>
                  <input
                    value={String(jobToDelete.slots)}
                    disabled
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 opacity-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="profile"
                  onClick={() => setJobToDelete(null)}
                  className="rounded-xl border-zinc-800 bg-black/40 text-zinc-200 hover:bg-white/[0.03]"
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => {
                    const jobId = jobToDelete._id || (jobToDelete as { id?: string }).id;

                    if (jobId) {
                      void handleDelete(jobId);
                    }
                  }}
                  className="rounded-xl border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
                >
                  {t('deleteJob')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
