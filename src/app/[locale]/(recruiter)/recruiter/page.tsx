import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RecruiterDashboard } from '@/features/recruiter-dashboard/components/recruiter-dashboard';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');

  return {
    title: t('recruiterDashboard'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function RecruiterDashboardPage() {
  return <RecruiterDashboard />;
}
