'use client';

import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import {
  Clock3,
  Globe,
  Laptop2,
  MonitorSmartphone,
  ShieldCheck,
  ShieldX,
  TimerReset,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthSessionResponse } from '@/services/auth/auth.types';
import { getFriendlySessionDevice } from '@/utils/session-device';

interface SessionCardProps {
  session: AuthSessionResponse;
  index?: number;
  onRevoke: (sessionId: string) => Promise<void>;
}

function formatSessionDate(value: string | Date | undefined, locale: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : locale, {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date);
}

function formatRelativeTime(
  value: string | Date | undefined,
  t: ReturnType<typeof useTranslations>,
) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const diffInMinutes = Math.max(1, Math.round((Date.now() - date.getTime()) / 60000));

  if (diffInMinutes < 60) {
    return t('minutesAgo', { count: diffInMinutes });
  }

  const diffInHours = Math.round(diffInMinutes / 60);

  if (diffInHours < 24) {
    return t('hoursAgo', { count: diffInHours });
  }

  const diffInDays = Math.round(diffInHours / 24);
  return t('daysAgo', { count: diffInDays });
}

function formatSessionDuration(
  createdAt?: string | Date,
  revokedAt?: string | Date,
  expiresAt?: string | Date,
) {
  if (!createdAt) {
    return null;
  }

  const createdAtDate = new Date(createdAt);
  const endDate = revokedAt ? new Date(revokedAt) : new Date();

  if (Number.isNaN(createdAtDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return null;
  }

  const maxEndDate =
    expiresAt && !revokedAt && !Number.isNaN(new Date(expiresAt).getTime())
      ? new Date(Math.min(endDate.getTime(), new Date(expiresAt).getTime()))
      : endDate;

  const diffInMs = maxEndDate.getTime() - createdAtDate.getTime();

  if (diffInMs <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(diffInMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function SessionCard({ session, index = 0, onRevoke }: SessionCardProps) {
  const t = useTranslations('Sessions');
  const locale = useLocale();
  const isRevoked = Boolean(session.revokedAt);
  const deviceLabel = getFriendlySessionDevice(session.userAgent);
  const createdAtLabel = formatSessionDate(session.createdAt, locale);
  const expiresAtLabel = formatSessionDate(session.expiresAt, locale);
  const revokedAtLabel = formatSessionDate(session.revokedAt, locale);
  const lastSeenLabel = formatRelativeTime(session.createdAt, t);
  const totalSessionTime = formatSessionDuration(
    session.createdAt,
    session.revokedAt,
    session.expiresAt,
  );

  async function handleRevoke() {
    await onRevoke(session.id);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.04 }}
      className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 backdrop-blur transition-all duration-300 hover:border-lime-500/20 hover:bg-zinc-950/90 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.05),0_18px_60px_rgba(0,0,0,0.28)]"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
              <MonitorSmartphone className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-base font-semibold text-zinc-50">{deviceLabel}</h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] ${
                    isRevoked
                      ? 'border-red-500/20 bg-red-500/10 text-red-200'
                      : 'border-lime-500/20 bg-lime-500/10 text-lime-300'
                  }`}
                >
                  {isRevoked ? (
                    <ShieldX className="h-3.5 w-3.5" />
                  ) : (
                    <ShieldCheck className="h-3.5 w-3.5" />
                  )}
                  {isRevoked ? t('revokedStatus') : t('activeStatus')}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                {session.userAgent || t('unknownUserAgent')}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                <Globe className="h-3.5 w-3.5" />
                IP
              </div>
              <p className="mt-2 text-sm text-zinc-200">{session.ipAddress || t('notProvided')}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                <Clock3 className="h-3.5 w-3.5" />
                {t('started')}
              </div>
              <p className="mt-2 text-sm text-zinc-200">{createdAtLabel || t('noRecord')}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                <TimerReset className="h-3.5 w-3.5" />
                {t('duration')}
              </div>
              <p className="mt-2 text-sm text-zinc-200">{totalSessionTime || t('processing')}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                <Laptop2 className="h-3.5 w-3.5" />
                {t('lastActivity')}
              </div>
              <p className="mt-2 text-sm text-zinc-200">{lastSeenLabel || t('justNow')}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
            {expiresAtLabel && (
              <span>
                {t('expiresIn')}: <span className="text-zinc-300">{expiresAtLabel}</span>
              </span>
            )}
            {revokedAtLabel && (
              <span>
                {t('revokedAt')}: <span className="text-zinc-300">{revokedAtLabel}</span>
              </span>
            )}
          </div>
        </div>

        {!isRevoked && (
          <div className="shrink-0">
            <Button
              type="button"
              variant="danger"
              onClick={handleRevoke}
              className="rounded-xl border-red-500/20 bg-red-500/10 px-4 py-2.5 text-red-200 hover:bg-red-500/15"
            >
              {t('revokeSession')}
            </Button>
          </div>
        )}
      </div>
    </motion.article>
  );
}
