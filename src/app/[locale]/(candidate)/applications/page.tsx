import { Metadata } from 'next';
import { ApplicationList } from '@/components/applications/application-list';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ROUTES } from '@/constants/routes';
import { PAGE_STYLES } from '@/constants/styles';

export const metadata: Metadata = {
  title: 'Minhas candidaturas',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ApplicationsPage() {
  return (
    <section className={`${PAGE_STYLES.body} py-20`}>
      <div className={PAGE_STYLES.container}>
        <Breadcrumb
          items={[{ label: 'Home', href: ROUTES.HOME }, { label: 'Minhas candidaturas' }]}
        />
        <div className="mt-10">
          <ApplicationList />
        </div>
      </div>
    </section>
  );
}
