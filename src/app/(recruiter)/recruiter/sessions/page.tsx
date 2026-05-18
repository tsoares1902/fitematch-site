import { Metadata } from 'next';
import { MonitorSmartphone } from 'lucide-react';
import { SessionList } from '@/components/sessions/session-list';
import { DashboardShell } from '@/features/recruiter-dashboard/components/dashboard-shell';

export const metadata: Metadata = {
  title: 'Sessões recruiter',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterSessionsPage() {
  return (
    <DashboardShell title="Sessões" subtitle="Área do recrutador">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
          <MonitorSmartphone className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-3xl font-semibold uppercase tracking-[-0.05em] text-zinc-50">
            Gerencie suas sessões
          </h2>
        </div>
      </div>
      <SessionList />
    </DashboardShell>
  );
}
