import { Metadata } from 'next';
import { MonitorSmartphone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { SessionList } from '@/components/sessions/session-list';
import { CandidateDashboardShell } from '@/features/candidate-dashboard/components/candidate-dashboard-shell';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');

  return {
    title: t('sessions'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CandidateSessionsPage() {
  const t = await getTranslations('Dashboard');

  return (
    <CandidateDashboardShell title={t('sessions')} subtitle={t('candidateArea')}>
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
          <MonitorSmartphone className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-3xl font-semibold uppercase tracking-[-0.05em] text-zinc-50">
            {t('manageSessions')}
          </h2>
        </div>
      </div>
      <SessionList />
    </CandidateDashboardShell>
  );
}
