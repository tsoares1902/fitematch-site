import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CandidateDashboard } from '@/features/candidate-dashboard/components/candidate-dashboard';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');

  return {
    title: t('candidateDashboard'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function CandidateDashboardPage() {
  return <CandidateDashboard />;
}
