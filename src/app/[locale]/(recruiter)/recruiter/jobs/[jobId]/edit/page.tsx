'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';
import { RecruiterJobForm } from '@/components/recruiter/jobs/recruiter-job-form';
import { ROUTES } from '@/constants/routes';
import { PAGE_STYLES } from '@/constants/styles';
import { useMyJob } from '@/hooks/use-my-job';

export default function RecruiterEditJobPage() {
  const t = useTranslations('RecruiterJobs');
  const params = useParams<{ jobId: string }>();
  const jobId = params.jobId;

  const { job, isLoading, error } = useMyJob(jobId);

  return (
    <section className={`${PAGE_STYLES.body} py-20`}>
      <div className={PAGE_STYLES.container}>
        <RecruiterPageHeader
          breadcrumbs={[
            { label: t('home'), href: ROUTES.HOME },
            { label: t('myJobs'), href: ROUTES.RECRUITER_JOBS },
            { label: t('editJob') },
          ]}
          title={t('editJob')}
          description={t('editJobDescription')}
        />

        {isLoading && <p className="text-gray-700">{t('loadingJob')}</p>}

        {error && <p className="text-red-100">{error}</p>}

        {!isLoading && job && <RecruiterJobForm mode="edit" jobId={jobId} initialValues={job} />}
      </div>
    </section>
  );
}
