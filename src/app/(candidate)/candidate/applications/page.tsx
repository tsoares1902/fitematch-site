import { Metadata } from 'next';
import { ApplicationList } from '@/components/applications/application-list';
import { CandidateDashboardShell } from '@/features/candidate-dashboard/components/candidate-dashboard-shell';

export const metadata: Metadata = {
  title: 'Applications candidate',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CandidateApplicationsPage() {
  return (
    <CandidateDashboardShell title="Applications" subtitle="Área do candidato">
      <ApplicationList />
    </CandidateDashboardShell>
  );
}
