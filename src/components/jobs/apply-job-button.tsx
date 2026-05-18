'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPaperPlane } from 'react-icons/fa';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { ApplyService } from '@/services/apply/apply.service';
import { ProductRoleEnum } from '@/types/entities/user.entity';

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
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useFlashMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const isCandidate = user?.productRole === ProductRoleEnum.CANDIDATE;
  const isRecruiter = user?.productRole === ProductRoleEnum.RECRUITER;

  const canApply = isAuthenticated && isCandidate && !hasAlreadyApplied;

  function handleOpenConfirmModal() {
    if (!isAuthenticated) {
      showError('Você precisa estar logado para se candidatar.');
      return;
    }

    if (isRecruiter) {
      showError('Recrutadores não podem se candidatar a vagas.');
      return;
    }

    if (!isCandidate) {
      showError('Apenas candidatos podem se candidatar a vagas.');
      return;
    }

    if (hasAlreadyApplied) {
      showError('Você já se candidatou a esta vaga.');
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

      showSuccess('Candidatura realizada com sucesso.');
      setIsConfirmModalOpen(false);
      await refetch?.();
      onApplied?.();
      router.refresh();
    } catch {
      showError('Não foi possível realizar sua candidatura.');
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
          {hasAlreadyApplied ? 'Candidatura enviada' : 'Aplicar'}
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
                  Confirmar candidatura
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Deseja confirmar sua aplicação para esta vaga?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-black/40 text-zinc-400 transition-colors hover:text-zinc-100"
                aria-label="Fechar modal"
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
                Voltar
              </Button>
              <Button
                type="button"
                variant="positive"
                icon={<FaPaperPlane />}
                onClick={() => void handleApply()}
                disabled={isSubmitting}
                className="rounded-xl border-lime-500/20 bg-lime-500/10 text-lime-300 hover:bg-lime-500/15"
              >
                {isSubmitting ? 'Aplicando' : 'Confirmar aplicação'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
