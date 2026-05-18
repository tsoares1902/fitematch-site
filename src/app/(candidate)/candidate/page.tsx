import { Metadata } from 'next';
import { CandidateDashboard } from '@/features/candidate-dashboard/components/candidate-dashboard';

export const metadata: Metadata = {
  title: 'Dashboard candidate',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CandidateDashboardPage() {
  return <CandidateDashboard />;
}
