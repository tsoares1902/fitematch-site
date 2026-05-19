'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarClock,
  CircleCheckBig,
  Users,
} from 'lucide-react';
import { DashboardShell } from './dashboard-shell';
import { useRecruiterJobs } from '@/hooks/use-recruiter-jobs';
import { ApplyService } from '@/services/apply/apply.service';
import ApplyEntity, { ApplicationStatusEnum } from '@/types/entities/apply.entity';
import { JobStatusEnum } from '@/types/entities/job.entity';

function formatDate(date: Date | undefined, locale: string, fallback: string) {
  if (!date) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : locale, {
    day: '2-digit',
    month: 'short',
  }).format(new Date(date));
}

export function RecruiterDashboard() {
  const t = useTranslations('RecruiterDashboard');
  const locale = useLocale();
  const { jobs, isLoading, error } = useRecruiterJobs();
  const [recentApplications, setRecentApplications] = useState<ApplyEntity[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadApplications() {
      if (jobs.length === 0) {
        setRecentApplications([]);
        setApplicationsLoading(false);
        return;
      }

      try {
        setApplicationsLoading(true);

        const topJobs = jobs.slice(0, 4);
        const responses = await Promise.all(topJobs.map((job) => ApplyService.listByJob(job._id)));

        const merged = responses
          .flat()
          .sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
          })
          .slice(0, 6);

        if (isMounted) {
          setRecentApplications(merged);
        }
      } catch {
        if (isMounted) {
          setRecentApplications([]);
        }
      } finally {
        if (isMounted) {
          setApplicationsLoading(false);
        }
      }
    }

    void loadApplications();

    return () => {
      isMounted = false;
    };
  }, [jobs]);

  const metrics = useMemo(() => {
    const activeJobs = jobs.filter((job) => job.status === JobStatusEnum.ACTIVE).length;
    const totalSlots = jobs.reduce((sum, job) => sum + job.slots, 0);
    const shortlisted = recentApplications.filter(
      (application) => application.status === ApplicationStatusEnum.SHORTLISTED,
    ).length;

    return [
      {
        label: t('activeJobs'),
        value: String(activeJobs),
        meta: t('operationalPipeline'),
        icon: BriefcaseBusiness,
      },
      {
        label: t('recentApplications'),
        value: String(recentApplications.length),
        meta: t('latestRecords'),
        icon: Users,
      },
      {
        label: t('shortlistedProfiles'),
        value: String(shortlisted),
        meta: t('highFit'),
        icon: CircleCheckBig,
      },
      {
        label: t('openPositions'),
        value: String(totalSlots),
        meta: t('totalCapacity'),
        icon: Activity,
      },
    ];
  }, [jobs, recentApplications, t]);

  const chartData = [
    { label: t('mon'), value: 5 },
    { label: t('tue'), value: 8 },
    { label: t('wed'), value: 6 },
    { label: t('thu'), value: 10 },
    { label: t('fri'), value: 12 },
    { label: t('sat'), value: 7 },
    { label: t('sun'), value: 4 },
  ];

  return (
    <DashboardShell title="" subtitle="">
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;

            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur transition-all duration-300 hover:border-lime-500/25 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.06),0_18px_60px_rgba(0,0,0,0.32),0_0_28px_rgba(34,197,94,0.06)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.24em] text-zinc-600">
                    {metric.meta}
                  </span>
                </div>
                <p className="mt-6 text-sm text-zinc-500">{metric.label}</p>
                <p className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-zinc-50">
                  {metric.value}
                </p>
              </motion.div>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">{t('candidatesByDay')}</p>
                <h2 className="mt-1 text-xl font-semibold text-zinc-50">
                  {t('pipelineIntensity')}
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-lime-500/20 bg-lime-500/10 px-3 py-1 text-xs text-lime-300">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +18%
              </span>
            </div>

            <div className="mt-10 flex h-64 items-end justify-between gap-3">
              {chartData.map((item) => (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex h-52 w-full items-end rounded-2xl border border-zinc-900 bg-black/50 p-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${item.value * 14}px` }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className="w-full rounded-xl bg-gradient-to-t from-lime-600 to-lime-300 shadow-[0_0_24px_rgba(132,204,22,0.16)]"
                    />
                  </div>
                  <span className="text-xs text-zinc-500">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">{t('recentApplications')}</p>
                <h2 className="mt-1 text-xl font-semibold text-zinc-50">{t('latestActivity')}</h2>
              </div>
              <CalendarClock className="h-4 w-4 text-zinc-600" />
            </div>

            <div className="mt-6 space-y-3">
              {applicationsLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-2xl border border-zinc-800 bg-black/50"
                  />
                ))}

              {!applicationsLoading &&
                recentApplications.map((application) => (
                  <div
                    key={application._id}
                    className="rounded-2xl border border-zinc-800 bg-black/50 p-4 transition-all duration-300 hover:border-lime-500/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-zinc-100">
                          {application.user?.name || t('candidateFallback')}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {application.details?.jobTitle || t('activeJobFallback')}
                        </p>
                      </div>
                      <span className="rounded-full border border-zinc-800 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                        {application.status}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-zinc-600">
                      {formatDate(application.createdAt, locale, t('noDate'))}
                    </p>
                  </div>
                ))}

              {!applicationsLoading && recentApplications.length === 0 && (
                <div className="rounded-2xl border border-zinc-800 bg-black/50 p-5 text-sm text-zinc-500">
                  {t('noRecentApplications')}
                </div>
              )}
            </div>
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/90 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
            <div>
              <p className="text-sm text-zinc-500">{t('jobsTable')}</p>
              <h2 className="mt-1 text-xl font-semibold text-zinc-50">{t('activeOperation')}</h2>
            </div>
            <span className="text-sm text-zinc-500">{t('records', { count: jobs.length })}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800 text-left">
              <thead className="bg-black/30">
                <tr className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  <th className="px-6 py-4 font-medium">{t('job')}</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Slots</th>
                  <th className="px-6 py-4 font-medium">{t('updatedAt')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {isLoading &&
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={4} className="px-6 py-5">
                        <div className="h-10 animate-pulse rounded-xl bg-black/50" />
                      </td>
                    </tr>
                  ))}

                {!isLoading &&
                  jobs.map((job, index) => (
                    <tr
                      key={
                        job._id ||
                        job.slug ||
                        `${job.title}-${job.updatedAt || job.createdAt || index}`
                      }
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-sm font-medium text-zinc-100">{job.title}</p>
                          <p className="mt-1 text-sm text-zinc-500">
                            {job.company?.tradeName || t('companyNotProvided')}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="rounded-full border border-lime-500/20 bg-lime-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-lime-300">
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-zinc-300">{job.slots}</td>
                      <td className="px-6 py-5 text-sm text-zinc-500">
                        {formatDate(job.updatedAt, locale, t('noDate'))}
                      </td>
                    </tr>
                  ))}

                {!isLoading && jobs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-zinc-500">
                      {t('noJobs')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.section>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
