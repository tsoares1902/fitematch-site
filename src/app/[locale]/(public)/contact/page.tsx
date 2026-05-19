import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ROUTES } from '@/constants/routes';
import { ContactChannels } from '@/features/contact/components/contact-channels';
import { ContactForm } from '@/features/contact/components/contact-form';
import { ContactMap } from '@/features/contact/components/contact-map';
import type { Locale } from '@/i18n/config';
import { publicPageMetadata } from '@/utils/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return publicPageMetadata({
    locale,
    pathname: '/contact',
    titleKey: 'contact',
    descriptionKey: 'contactDescription',
  });
}

export default async function ContactPage() {
  const t = await getTranslations('contact');

  return (
    <section className="min-h-screen bg-black py-20 text-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: t('breadcrumb.home'), href: ROUTES.HOME },
            { label: t('breadcrumb.contact') },
          ]}
        />

        <div className="mt-8">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            {t('header.title')}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            {t('header.description')}
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:items-start">
          <ContactForm />

          <div className="space-y-4">
            <ContactMap />
            <ContactChannels />
          </div>
        </div>
      </div>
    </section>
  );
}
