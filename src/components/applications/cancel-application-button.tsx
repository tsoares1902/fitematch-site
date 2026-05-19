'use client';

import { FaTrash } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ApplyService } from '@/services/apply/apply.service';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { ROUTES } from '@/constants/routes';
import { useRouter } from '@/i18n/navigation';

interface CancelApplicationButtonProps {
  applyId: string;
  onDeleted?: () => Promise<void> | void;
}

export function CancelApplicationButton({ applyId, onDeleted }: CancelApplicationButtonProps) {
  const router = useRouter();
  const t = useTranslations('Applications');
  const { showSuccess, showError } = useFlashMessage();

  async function handleCancel() {
    try {
      await ApplyService.delete(applyId);
      showSuccess(t('cancelSuccess'));
      await onDeleted?.();
      router.push(ROUTES.APPLICATIONS);
    } catch {
      showError(t('cancelError'));
    }
  }

  return (
    <Button type="button" variant="danger" icon={<FaTrash />} onClick={handleCancel}>
      {t('cancelApplication')}
    </Button>
  );
}
