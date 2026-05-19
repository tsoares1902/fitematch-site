import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';
import { RecruiterJobForm } from '@/components/recruiter/jobs/recruiter-job-form';
import { ROUTES } from '@/constants/routes';
import { DashboardShell } from '@/features/recruiter-dashboard/components/dashboard-shell';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');

  return {
    title: t('newJob'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function RecruiterNewJobPage() {
  const t = await getTranslations('RecruiterJobs');

  return (
    <DashboardShell title="" subtitle="">
      <div className="mx-auto w-full max-w-7xl">
        <RecruiterPageHeader
          breadcrumbs={[
            { label: t('home'), href: ROUTES.HOME },
            { label: t('myJobs'), href: ROUTES.RECRUITER_JOBS },
            { label: t('newJob') },
          ]}
          title=""
          description=""
        />

        <RecruiterJobForm mode="create" />
      </div>
    </DashboardShell>
  );
}
