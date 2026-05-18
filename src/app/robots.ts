import { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/profile',
          '/sessions',
          '/applications',
          '/candidate',
          '/recruiter',
          '/sign-in',
          '/sign-up',
          '/activation-code',
          '/activate-account',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
