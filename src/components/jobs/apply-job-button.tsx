'use client';

import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { ApplyService } from '@/services/apply/apply.service';
import { ProductRoleEnum } from '@/types/entities/user.entity';
import { useRouter } from '@/i18n/navigation';

interface ApplyJobButtonProps {
  jobId: string;
  hasAlreadyApplied?: boolean;
  onApplied?: () => void;
  refetch?: () => Promise<void> | void;
}

export function ApplyJobButton({
  jobId,
  hasAlreadyApplied = false,
  onApplied,
  refetch,
}: ApplyJobButtonProps) {
  const router = useRouter();
  const t = useTranslations('Jobs');
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useFlashMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const isCandidate = user?.productRole === ProductRoleEnum.CANDIDATE;
  const isRecruiter = user?.productRole === ProductRoleEnum.RECRUITER;

  const canApply = isAuthenticated && isCandidate && !hasAlreadyApplied;

  function handleOpenConfirmModal() {
    if (!isAuthenticated) {
      showError(t('loginRequired'));
      return;
    }

    if (isRecruiter) {
      showError(t('recruiterCannotApply'));
      return;
    }

    if (!isCandidate) {
      showError(t('candidateOnly'));
      return;
    }

    if (hasAlreadyApplied) {
      showError(t('alreadyApplied'));
      return;
    }

    setIsConfirmModalOpen(true);
  }

  async function handleApply() {
    try {
      setIsSubmitting(true);

      await ApplyService.create({
        jobId,
      });

      showSuccess(t('applySuccess'));
      setIsConfirmModalOpen(false);
      await refetch?.();
      onApplied?.();
      router.refresh();
    } catch {
      showError(t('applyError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {isCandidate && isAuthenticated && (
        <Button
          type="button"
          variant="positive"
          icon={<FaPaperPlane />}
          disabled={!canApply || isSubmitting}
          onClick={handleOpenConfirmModal}
          className="rounded-xl border-lime-500/20 bg-lime-500/10 text-lime-300 hover:bg-lime-500/15"
        >
          {hasAlreadyApplied ? t('applicationSent') : t('apply')}
        </Button>
      )}

      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-confirm-title"
            className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="apply-confirm-title" className="text-xl font-semibold text-zinc-100">
                  {t('confirmApplication')}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {t('confirmApplicationDescription')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-black/40 text-zinc-400 transition-colors hover:text-zinc-100"
                aria-label={t('closeModal')}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="profile"
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isSubmitting}
                className="rounded-xl border-zinc-800 bg-black/40 text-zinc-200 hover:bg-white/[0.03]"
              >
                {t('back')}
              </Button>
              <Button
                type="button"
                variant="positive"
                icon={<FaPaperPlane />}
                onClick={() => void handleApply()}
                disabled={isSubmitting}
                className="rounded-xl border-lime-500/20 bg-lime-500/10 text-lime-300 hover:bg-lime-500/15"
              >
                {isSubmitting ? t('applying') : t('confirmApply')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
