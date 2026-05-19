import { Metadata } from 'next';
import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';
import { RecruiterJobsList } from '@/components/recruiter/jobs/recruiter-jobs-list';
import { DashboardShell } from '@/features/recruiter-dashboard/components/dashboard-shell';
import { Link } from '@/i18n/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');

  return {
    title: t('recruiterJobs'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function RecruiterJobsPage() {
  const t = await getTranslations('RecruiterJobs');

  return (
    <DashboardShell title="" subtitle="">
      <div className="mx-auto w-full max-w-7xl">
        <RecruiterPageHeader
          breadcrumbs={[{ label: t('home'), href: ROUTES.HOME }, { label: t('myJobs') }]}
          title=""
          description=""
          action={
            <Link href={ROUTES.RECRUITER_NEW_JOB}>
              <Button
                variant="positive"
                icon={<Plus className="h-4 w-4" />}
                className="rounded-xl border-lime-500/20 bg-lime-500/10 text-lime-300 hover:bg-lime-500/15"
              >
                {t('createNewJob')}
              </Button>
            </Link>
          }
        />

        <RecruiterJobsList />
      </div>
    </DashboardShell>
  );
}
