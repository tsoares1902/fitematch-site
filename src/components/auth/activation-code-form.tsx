'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InlineFlashMessage } from '@/components/ui/inline-flash-message';
import { ROUTES } from '@/constants/routes';
import { AuthService } from '@/services/auth/auth.service';
import { RequestActivationCodeRequest } from '@/services/auth/auth.types';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { Link } from '@/i18n/navigation';

export function ActivationCodeForm() {
  const t = useTranslations('Auth');
  const { flashMessage, showSuccess, showError } = useFlashMessage();
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestActivationCodeRequest>();

  async function onSubmit(data: RequestActivationCodeRequest) {
    try {
      await AuthService.requestActivationCode(data);
      setCooldown(60);
      showSuccess(t('activationCodeSuccess'));
    } catch {
      showError(t('activationCodeError'));
    }
  }

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCooldown((current) => current - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [cooldown]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-md rounded-[2rem] border border-zinc-800 bg-zinc-950/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur"
    >
      <div className="mb-8">
        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-zinc-50 uppercase">
          {t('activationCodeTitle')}
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">{t('activationCodeDescription')}</p>
      </div>

      <div className="space-y-4">
        {flashMessage && (
          <InlineFlashMessage type={flashMessage.type} message={flashMessage.message} />
        )}

        <Input
          icon={<FaEnvelope />}
          type="email"
          placeholder={t('email')}
          error={errors.email?.message}
          className="border-zinc-800 bg-black text-zinc-100 placeholder:text-zinc-500"
          {...register('email', {
            required: t('emailRequired'),
          })}
        />
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          type="submit"
          variant="positive"
          icon={<FaPaperPlane />}
          disabled={isSubmitting || cooldown > 0}
          className="w-full rounded-2xl border border-lime-500/30 bg-lime-500/10 py-3 text-lime-300 transition-all duration-300 hover:border-lime-400/40 hover:bg-lime-500/14 hover:text-lime-200 sm:w-auto"
        >
          {t('requestActivationCode')}
        </Button>
      </div>

      {cooldown > 0 && (
        <p className="mt-3 text-center text-sm text-zinc-500">
          {t('requestNewCodeIn', { cooldown })}
        </p>
      )}

      <p className="mt-6 text-center text-sm text-zinc-500">
        {t('alreadyReceivedCode')}{' '}
        <Link
          href={ROUTES.ACTIVATE_ACCOUNT}
          className="text-lime-400 transition-colors hover:text-lime-300"
        >
          {t('activateAccount')}
        </Link>
      </p>
    </form>
  );
}
