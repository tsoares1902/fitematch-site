import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RecruiterCompanyForm } from '@/components/recruiter/company/recruiter-company-form';
import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';
import { ROUTES } from '@/constants/routes';
import { DashboardShell } from '@/features/recruiter-dashboard/components/dashboard-shell';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');

  return {
    title: t('recruiterCompany'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function RecruiterCompanyPage() {
  const t = await getTranslations('RecruiterCompany');

  return (
    <DashboardShell title="" subtitle="">
      <div className="mx-auto w-full max-w-7xl">
        <RecruiterPageHeader
          breadcrumbs={[{ label: t('home'), href: ROUTES.HOME }, { label: t('myCompany') }]}
          title=""
          description=""
        />

        <RecruiterCompanyForm />
      </div>
    </DashboardShell>
  );
}
