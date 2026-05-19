import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from '@/constants/seo';
import { locales, type Locale } from '@/i18n/config';

export function localizedAlternates(locale: Locale, pathname = ''): Metadata['alternates'] {
  const cleanPath = pathname === '/' ? '' : pathname;

  return {
    canonical: `${SITE_URL}/${locale}${cleanPath}`,
    languages: Object.fromEntries(locales.map((item) => [item, `${SITE_URL}/${item}${cleanPath}`])),
  };
}

export async function publicPageMetadata({
  locale,
  pathname,
  titleKey,
  descriptionKey,
}: {
  locale: Locale;
  pathname: string;
  titleKey: string;
  descriptionKey: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const title = t(titleKey);
  const description = t(descriptionKey);
  const url = `${SITE_URL}/${locale}${pathname === '/' ? '' : pathname}`;

  return {
    title: pathname === '/' ? { absolute: title } : title,
    description,
    alternates: localizedAlternates(locale, pathname),
    openGraph: {
      title: pathname === '/' ? title : `${title} | ${SITE_NAME}`,
      description,
      url,
      images: [{ url: absoluteUrl(DEFAULT_OG_IMAGE) }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pathname === '/' ? title : `${title} | ${SITE_NAME}`,
      description,
      images: [absoluteUrl(DEFAULT_OG_IMAGE)],
    },
  };
}
