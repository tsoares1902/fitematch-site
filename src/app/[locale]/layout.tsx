import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FlashMessage } from '@/components/ui/flash-message';
import { FlashMessageProvider } from '@/contexts/flash-message-context';
import { AuthProvider } from '@/contexts/auth-context';
import { routing } from '@/i18n/routing';
import { localeLabels, type Locale } from '@/i18n/config';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from '@/constants/seo';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = hasLocale(routing.locales, locale)
    ? (locale as Locale)
    : routing.defaultLocale;
  const t = await getTranslations({ locale: resolvedLocale, namespace: 'LocaleLayout' });
  const canonical = `${SITE_URL}/${resolvedLocale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('title'),
      template: `%s | ${SITE_NAME}`,
    },
    description: t('description'),
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical,
      languages: {
        pt: `${SITE_URL}/pt`,
        en: `${SITE_URL}/en`,
        es: `${SITE_URL}/es`,
      },
    },
    openGraph: {
      type: 'website',
      locale: localeLabels[resolvedLocale].htmlLang.replace('-', '_'),
      siteName: SITE_NAME,
      title: t('title'),
      description: t('description'),
      url: canonical,
      images: [
        {
          url: absoluteUrl(DEFAULT_OG_IMAGE),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [absoluteUrl(DEFAULT_OG_IMAGE)],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const resolvedLocale = locale as Locale;

  return (
    <NextIntlClientProvider messages={messages}>
      <FlashMessageProvider>
        <AuthProvider>
          <div lang={localeLabels[resolvedLocale].htmlLang}>
            <Header />
            <main>{children}</main>
            <Footer />
            <FlashMessage />
          </div>
        </AuthProvider>
      </FlashMessageProvider>
    </NextIntlClientProvider>
  );
}
