import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/constants/routes';
import { SOCIAL_LINKS } from '@/constants/social-links';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('Footer');
  const baseYear = 2026;
  const currentYear = new Date().getFullYear();
  const copyrightYears = currentYear > baseYear ? `${baseYear} - ${currentYear}` : `${baseYear}`;
  const footerLinks = [
    { href: ROUTES.JOBS, label: t('jobs') },
    { href: ROUTES.CONTACT, label: t('contact') },
    { href: ROUTES.FAQ, label: 'FAQ' },
    { href: ROUTES.PRIVACY_POLICY, label: t('privacy') },
    { href: ROUTES.TERMS_OF_USE, label: t('terms') },
  ];

  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3">
              <span className="text-xl font-semibold tracking-[-0.04em]">
                <span className="text-zinc-50">fite</span>
                <span className="text-lime-400">match</span>
              </span>
            </div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
              {t('channels')}
            </p>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-400 transition-all hover:-translate-y-0.5 ${item.hoverClassName}`}
                    aria-label={item.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div className="space-y-4 sm:col-start-2 sm:text-right">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
                {t('navigation')}
              </p>
              <div className="flex flex-col gap-3 sm:items-end">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-600" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4" />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-zinc-800 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {copyrightYears} fitematch. {t('rights')}
          </p>
          <p>
            {t('developedBy')}{' '}
            <a
              href="https://drowper.com"
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-zinc-100"
            >
              drowper
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
