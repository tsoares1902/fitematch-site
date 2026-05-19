'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BriefcaseBusiness, Building2, Clock3, ShieldCheck, Trash2, XCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ApplyService } from '@/services/apply/apply.service';
import ApplyEntity, { ApplicationStatusEnum } from '@/types/entities/apply.entity';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { resolveFileUrl } from '@/utils/file-url';

interface Props {
  application: ApplyEntity;
  index?: number;
  onDeleted?: () => void;
}

function getApplicationStatusLabel(
  status: ApplicationStatusEnum,
  t: ReturnType<typeof useTranslations>,
) {
  return {
    [ApplicationStatusEnum.APPLIED]: t('statusApplied'),
    [ApplicationStatusEnum.SHORTLISTED]: t('statusShortlisted'),
    [ApplicationStatusEnum.REJECTED]: t('statusRejected'),
    [ApplicationStatusEnum.HIRED]: t('statusHired'),
  }[status];
}

export function ApplicationCard({ application, index = 0, onDeleted }: Props) {
  const t = useTranslations('Applications');
  const locale = useLocale();
  const { showSuccess, showError } = useFlashMessage();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const statusLabel = getApplicationStatusLabel(application.status, t);
  const details = (
    application as ApplyEntity & {
      details?: {
        jobTitle?: string;
        tradeName?: string;
        logoUrl?: string;
      };
    }
  ).details;
  const jobTitle = details?.jobTitle || t('untitledJob');
  const companyName = details?.tradeName || t('companyFallback');
  const logoUrl = details?.logoUrl;
  const companyInitials = companyName.slice(0, 2).toUpperCase();
  const applyId = application._id || application.id || '';
  const headingTitle = jobTitle;
  const detailedJobTitle = `${companyName} - ${jobTitle}`;
  const appliedAt = application.createdAt ? formatAppliedAt(application.createdAt, locale) : null;

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await ApplyService.delete(applyId);
      showSuccess(t('cancelSuccess'));
      onDeleted?.();
    } catch {
      showError(t('cancelError'));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: index * 0.04 }}
        className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur transition-all duration-300 hover:border-lime-500/20 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.05),0_18px_60px_rgba(0,0,0,0.28)]"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex min-w-0 items-center gap-4">
              {logoUrl ? (
                <Image
                  src={resolveFileUrl(logoUrl)}
                  alt={companyName}
                  width={56}
                  height={56}
                  unoptimized
                  className="h-14 w-14 rounded-2xl border border-zinc-800 bg-white/95 object-cover p-2"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-black/40 text-sm font-semibold text-zinc-200">
                  {companyInitials}
                </div>
              )}

              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold text-zinc-100">{headingTitle}</h2>
                <div className="mt-2 flex items-center gap-2 text-sm text-lime-400">
                  <Building2 className="h-4 w-4 shrink-0 text-lime-400" />
                  <span className="truncate">{companyName}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-black/35 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                <BriefcaseBusiness className="h-3.5 w-3.5" />
                {t('job')}
              </div>
              <p className="mt-2 text-sm text-zinc-200">{detailedJobTitle}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-black/35 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5" />
                Status
              </div>
              <p className="mt-2 text-sm text-zinc-200">{statusLabel}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-black/35 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                <Clock3 className="h-3.5 w-3.5" />
                {t('appliedAt')}
              </div>
              <p className="mt-2 text-sm text-zinc-200">{appliedAt || t('noRecord')}</p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button
              variant="danger"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={isDeleting}
              className="rounded-xl border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
            >
              {t('cancelApplication')}
            </Button>
          </div>
        </div>
      </motion.article>

      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 text-xl font-semibold uppercase text-zinc-100">
                <XCircle className="h-5 w-5 shrink-0 text-red-300" />
                <h2>{t('cancelApplicationTitle')}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-2xl leading-none text-zinc-400 transition-colors hover:text-zinc-100"
                aria-label={t('closeModal')}
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-zinc-300">
                {t('cancelApplicationDescription', { job: jobTitle, company: companyName })}
              </p>
              <div className="rounded-2xl border border-zinc-800 bg-black/50 p-5">
                <div className="flex items-center gap-4">
                  {logoUrl ? (
                    <Image
                      src={resolveFileUrl(logoUrl)}
                      alt={companyName}
                      width={48}
                      height={48}
                      unoptimized
                      className="h-12 w-12 rounded-xl border border-zinc-800 bg-white/95 object-cover p-2"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-black text-sm font-semibold text-zinc-200">
                      {companyInitials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-zinc-100">{headingTitle}</p>
                    <div className="mt-1 flex items-center gap-2 text-sm text-lime-400">
                      <Building2 className="h-4 w-4 shrink-0 text-lime-400" />
                      <span className="truncate">{companyName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="profile"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="rounded-xl border-zinc-800 bg-black/40 text-zinc-200 hover:bg-white/[0.03]"
                >
                  {t('back')}
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={async () => {
                    await handleDelete();
                    setIsConfirmModalOpen(false);
                  }}
                  disabled={isDeleting}
                  className="rounded-xl border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
                >
                  {t('confirmCancellation')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function formatAppliedAt(value: string | Date, locale: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const datePart = date.toLocaleDateString(locale === 'pt' ? 'pt-BR' : locale, {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
  const timePart = date.toLocaleTimeString(locale === 'pt' ? 'pt-BR' : locale, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${datePart} - ${timePart}`;
}
