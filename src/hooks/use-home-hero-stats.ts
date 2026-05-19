'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardService } from '@/services/dashboard/dashboard.service';

interface HomeHeroStat {
  label: string;
  value: string;
  meta: string;
}

interface UseHomeHeroStatsState {
  stats: HomeHeroStat[];
  isLoading: boolean;
}

type HomeTranslator = ReturnType<typeof useTranslations>;

function formatWeeklyMeta(
  total: number,
  singularKey: string,
  pluralKey: string,
  t: HomeTranslator,
): string {
  return total === 1 ? t(singularKey) : t(pluralKey, { count: total });
}

function createInitialStats(t: HomeTranslator): HomeHeroStat[] {
  return [
    {
      label: t('registeredUsers'),
      value: '0',
      meta: t('loadingStats'),
    },
    {
      label: t('verifiedCompanies'),
      value: '0',
      meta: t('loadingStats'),
    },
    {
      label: t('activeJobsOnSite'),
      value: '0',
      meta: t('loadingStats'),
    },
    {
      label: t('activeApplications'),
      value: '0',
      meta: t('loadingStats'),
    },
  ];
}

export function useHomeHeroStats() {
  const t = useTranslations('Home');
  const [state, setState] = useState<UseHomeHeroStatsState>({
    stats: createInitialStats(t),
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const summary = await DashboardService.summary();

        if (!isMounted) {
          return;
        }

        setState({
          stats: [
            {
              label: t('registeredUsers'),
              value: String(summary.users.total),
              meta: summary.users.lastWeek
                ? formatWeeklyMeta(summary.users.lastWeek, 'weeklyNewUser', 'weeklyNewUsers', t)
                : t('noNewUsersWeek'),
            },
            {
              label: t('verifiedCompanies'),
              value: String(summary.companies.total),
              meta: summary.companies.lastWeek
                ? formatWeeklyMeta(
                    summary.companies.lastWeek,
                    'weeklyNewCompany',
                    'weeklyNewCompanies',
                    t,
                  )
                : t('noNewCompaniesWeek'),
            },
            {
              label: t('activeJobsOnSite'),
              value: String(summary.jobs.total),
              meta: summary.jobs.lastWeek
                ? formatWeeklyMeta(summary.jobs.lastWeek, 'weeklyNewJob', 'weeklyNewJobs', t)
                : t('noNewJobsWeek'),
            },
            {
              label: t('activeApplications'),
              value: String(summary.applications.total),
              meta: summary.applications.lastWeek
                ? formatWeeklyMeta(
                    summary.applications.lastWeek,
                    'weeklyNewApplication',
                    'weeklyNewApplications',
                    t,
                  )
                : t('noNewApplicationsWeek'),
            },
          ],
          isLoading: false,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setState({
          stats: [
            {
              label: t('registeredUsers'),
              value: '0',
              meta: t('statsLoadError'),
            },
            {
              label: t('verifiedCompanies'),
              value: '0',
              meta: t('statsLoadError'),
            },
            {
              label: t('activeJobsOnSite'),
              value: '0',
              meta: t('statsLoadError'),
            },
            {
              label: t('activeApplications'),
              value: '0',
              meta: t('statsLoadError'),
            },
          ],
          isLoading: false,
        });
      }
    }

    void loadStats();

    return () => {
      isMounted = false;
    };
  }, [t]);

  return state;
}
