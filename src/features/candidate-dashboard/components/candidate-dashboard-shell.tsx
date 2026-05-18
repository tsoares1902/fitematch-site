'use client';

import {
  FileText,
  Globe2,
  LayoutDashboard,
  MonitorSmartphone,
  Server,
  UserRound,
} from 'lucide-react';
import { DashboardShell } from '@/features/recruiter-dashboard/components/dashboard-shell';
import { ROUTES } from '@/constants/routes';

const CANDIDATE_NAV_ITEMS = [
  { href: ROUTES.CANDIDATE_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.CANDIDATE_PROFILE, label: 'Perfil', icon: UserRound },
  { href: ROUTES.CANDIDATE_APPLICATIONS, label: 'Applications', icon: FileText },
  { href: ROUTES.CANDIDATE_SESSIONS, label: 'Sessões', icon: MonitorSmartphone },
];

export function CandidateDashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      title={title}
      subtitle={subtitle}
      homeHref={ROUTES.CANDIDATE_DASHBOARD}
      navItems={CANDIDATE_NAV_ITEMS}
      sidebarExtra={
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 backdrop-blur">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">Status</p>
          <div className="mt-4 space-y-3 text-sm text-zinc-400">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <Server className="h-4 w-4 text-lime-400" />
                API
              </span>
              <span className="text-lime-400">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-lime-400" />
                Site
              </span>
              <span className="text-lime-400">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <UserRound className="h-4 w-4 text-lime-400" />
                Perfil
              </span>
              <span className="text-zinc-200">Candidato</span>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </DashboardShell>
  );
}
