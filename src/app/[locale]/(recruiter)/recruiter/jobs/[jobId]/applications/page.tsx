'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';
import { RecruiterJobApplicationsList } from '@/components/recruiter/applications/recruiter-job-applications-list';
import { ROUTES } from '@/constants/routes';
import { PAGE_STYLES } from '@/constants/styles';
import { useMyJob } from '@/hooks/use-my-job';

export default function RecruiterJobApplicationsPage() {
  const t = useTranslations('RecruiterJobs');
  const params = useParams<{ jobId: string }>();
  const { job } = useMyJob(params.jobId);
  const breadcrumbTitle = job?.title || t('jobDetails');

  return (
    <section className={`${PAGE_STYLES.body} py-20`}>
      <div className={PAGE_STYLES.container}>
        <RecruiterPageHeader
          breadcrumbs={[
            { label: t('home'), href: ROUTES.HOME },
            { label: t('myJobs'), href: ROUTES.RECRUITER_JOBS },
            { label: breadcrumbTitle },
          ]}
          title=""
          description=""
        />

        <RecruiterJobApplicationsList jobId={params.jobId} jobTitle={job?.title} />
      </div>
    </section>
  );
}
