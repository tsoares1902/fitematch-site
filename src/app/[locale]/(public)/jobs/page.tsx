import { JobsPageContent } from '@/components/jobs/jobs-page-content';
import type { Locale } from '@/i18n/config';
import { publicPageMetadata } from '@/utils/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return publicPageMetadata({
    locale,
    pathname: '/jobs',
    titleKey: 'jobs',
    descriptionKey: 'jobsDescription',
  });
}

export default function JobsPage() {
  return <JobsPageContent />;
}
