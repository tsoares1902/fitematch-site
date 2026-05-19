import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ApplicationList } from '@/components/applications/application-list';
import { CandidateDashboardShell } from '@/features/candidate-dashboard/components/candidate-dashboard-shell';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');

  return {
    title: t('candidateApplications'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CandidateApplicationsPage() {
  const dashboard = await getTranslations('Dashboard');

  return (
    <CandidateDashboardShell
      title={dashboard('applications')}
      subtitle={dashboard('candidateArea')}
    >
      <ApplicationList />
    </CandidateDashboardShell>
  );
}
