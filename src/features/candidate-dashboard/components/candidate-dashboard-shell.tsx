'use client';

import {
  FileText,
  Globe2,
  LayoutDashboard,
  MonitorSmartphone,
  Server,
  UserRound,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DashboardShell } from '@/features/recruiter-dashboard/components/dashboard-shell';
import { ROUTES } from '@/constants/routes';

export function CandidateDashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const t = useTranslations('Dashboard');
  const candidateNavItems = [
    { href: ROUTES.CANDIDATE_DASHBOARD, label: t('dashboard'), icon: LayoutDashboard },
    { href: ROUTES.CANDIDATE_PROFILE, label: t('profile'), icon: UserRound },
    { href: ROUTES.CANDIDATE_APPLICATIONS, label: t('applications'), icon: FileText },
    { href: ROUTES.CANDIDATE_SESSIONS, label: t('sessions'), icon: MonitorSmartphone },
  ];

  return (
    <DashboardShell
      title={title}
      subtitle={subtitle}
      homeHref={ROUTES.CANDIDATE_DASHBOARD}
      navItems={candidateNavItems}
      sidebarExtra={
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 backdrop-blur">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
            {t('status')}
          </p>
          <div className="mt-4 space-y-3 text-sm text-zinc-400">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <Server className="h-4 w-4 text-lime-400" />
                {t('api')}
              </span>
              <span className="text-lime-400">{t('online')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-lime-400" />
                {t('site')}
              </span>
              <span className="text-lime-400">{t('online')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <UserRound className="h-4 w-4 text-lime-400" />
                {t('profile')}
              </span>
              <span className="text-zinc-200">{t('candidate')}</span>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </DashboardShell>
  );
}
