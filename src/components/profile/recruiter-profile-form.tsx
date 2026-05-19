'use client';

import { type ComponentType, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { FileText, Save, Send, UserRound, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/form/phone-input';
import { useAuth } from '@/hooks/use-auth';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { UpdateMeRequest } from '@/services/auth/auth.types';
import { ProfileSectionTitle } from './profile-section-title';

function formatBirthday(value?: string | Date) {
  if (!value) {
    return '';
  }

  if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString('pt-BR');
}

function hasValue(value: unknown) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return true;
}

const recruiterProfileSections: Array<{
  id: RecruiterProfileSectionId;
  titleKey: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { id: 'dados-basicos', titleKey: 'basicData', icon: FileText },
  { id: 'dados-recrutador', titleKey: 'recruiterData', icon: UserRound },
];

type RecruiterProfileSectionId = 'dados-basicos' | 'dados-recrutador';
type RecruiterProfileCompletion = Record<RecruiterProfileSectionId, boolean>;

export function RecruiterProfileForm() {
  const t = useTranslations('Profile');
  const { user, refreshMe, updateMe } = useAuth();
  const { showSuccess, showError } = useFlashMessage();
  const savedProfileCompletionBySection = useMemo<RecruiterProfileCompletion>(
    () => ({
      'dados-basicos': [user?.name, user?.email, user?.birthday].every(hasValue),
      'dados-recrutador': [
        user?.recruiterProfile?.tradeName,
        user?.recruiterProfile?.position,
        user?.recruiterProfile?.contacts?.phone?.country,
        user?.recruiterProfile?.contacts?.phone?.number,
      ].every(hasValue),
    }),
    [
      user?.birthday,
      user?.email,
      user?.name,
      user?.recruiterProfile?.contacts?.phone?.country,
      user?.recruiterProfile?.contacts?.phone?.number,
      user?.recruiterProfile?.position,
      user?.recruiterProfile?.tradeName,
    ],
  );
  const [completedSectionOverrides, setCompletedSectionOverrides] = useState<
    Partial<RecruiterProfileCompletion>
  >({});
  const visibleProfileCompletionBySection = useMemo(
    () => ({
      ...savedProfileCompletionBySection,
      ...completedSectionOverrides,
    }),
    [completedSectionOverrides, savedProfileCompletionBySection],
  );
  const [showBasic, setShowBasic] = useState(!savedProfileCompletionBySection['dados-basicos']);
  const [showRecruiter, setShowRecruiter] = useState(
    !savedProfileCompletionBySection['dados-recrutador'],
  );

  const boxClassName =
    'rounded-[1.75rem] border border-zinc-800 bg-black/90 p-7 shadow-[0_18px_50px_rgba(0,0,0,0.36)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-lime-300/25 hover:shadow-[0_0_0_1px_rgba(199,245,29,0.06),0_20px_52px_rgba(0,0,0,0.4)]';
  const fieldClassName =
    'rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 placeholder:text-zinc-500 disabled:border-zinc-800 disabled:bg-zinc-950 disabled:text-zinc-300 disabled:opacity-100';
  const labelClassName = 'text-zinc-300';
  const sectionTitleClassName = 'uppercase text-lime-400';
  const sectionIconClassName = 'text-lime-400';
  const sectionToggleIconClassName = 'text-zinc-500';
  const saveButtonClassName =
    'rounded-xl border-lime-500/20 bg-lime-500/10 text-lime-300 hover:bg-lime-500/15';
  const getSectionBoxClassName = (sectionId: RecruiterProfileSectionId) =>
    `${boxClassName} scroll-mt-24 ${
      visibleProfileCompletionBySection[sectionId]
        ? '!border-lime-400/60 shadow-[0_0_0_1px_rgba(163,230,53,0.16),0_18px_50px_rgba(0,0,0,0.36)] hover:!border-lime-300/80'
        : ''
    }`;
  const markSectionComplete = (sectionId: RecruiterProfileSectionId) => {
    setCompletedSectionOverrides((current) => ({
      ...current,
      [sectionId]: true,
    }));
  };

  const {
    register,
    reset,
    getValues,
    setValue,
    control,
    formState: { isSubmitting },
  } = useForm<UpdateMeRequest>({
    defaultValues: {
      name: user?.name || '',
      recruiterProfile: {
        tradeName: user?.recruiterProfile?.tradeName || '',
        position: user?.recruiterProfile?.position || '',
        contacts: {
          phone: {
            country: user?.recruiterProfile?.contacts?.phone?.country || '+55',
            number: user?.recruiterProfile?.contacts?.phone?.number || '',
            isWhatsapp: user?.recruiterProfile?.contacts?.phone?.isWhatsapp || false,
            isTelegram: user?.recruiterProfile?.contacts?.phone?.isTelegram || false,
          },
        },
      },
    },
  });

  useEffect(() => {
    if (!user?.recruiterProfile?.companyId || user?.recruiterProfile?.tradeName) {
      return;
    }

    queueMicrotask(() => {
      void refreshMe();
    });
  }, [refreshMe, user?.recruiterProfile?.companyId, user?.recruiterProfile?.tradeName]);

  useEffect(() => {
    reset({
      name: user?.name || '',
      recruiterProfile: {
        tradeName: user?.recruiterProfile?.tradeName || '',
        position: user?.recruiterProfile?.position || '',
        contacts: {
          phone: {
            country: user?.recruiterProfile?.contacts?.phone?.country || '+55',
            number: user?.recruiterProfile?.contacts?.phone?.number || '',
            isWhatsapp: user?.recruiterProfile?.contacts?.phone?.isWhatsapp || false,
            isTelegram: user?.recruiterProfile?.contacts?.phone?.isTelegram || false,
          },
        },
      },
    });
  }, [reset, user]);

  const phoneCountryValue = useWatch({
    control,
    name: 'recruiterProfile.contacts.phone.country',
  });
  const phoneNumberValue = useWatch({
    control,
    name: 'recruiterProfile.contacts.phone.number',
  });

  async function handleSaveBasic() {
    try {
      await updateMe({
        name: getValues('name'),
      });

      markSectionComplete('dados-basicos');
      showSuccess(t('basicDataSuccess'));
    } catch {
      showError(t('basicDataError'));
    }
  }

  async function handleSaveRecruiter() {
    const values = getValues();

    try {
      await updateMe({
        recruiterProfile: {
          ...user?.recruiterProfile,
          tradeName: values.recruiterProfile?.tradeName,
          position: values.recruiterProfile?.position,
          contacts: {
            ...user?.recruiterProfile?.contacts,
            phone: {
              ...user?.recruiterProfile?.contacts?.phone,
              country: values.recruiterProfile?.contacts?.phone?.country,
              number: values.recruiterProfile?.contacts?.phone?.number,
              isWhatsapp: values.recruiterProfile?.contacts?.phone?.isWhatsapp,
              isTelegram: values.recruiterProfile?.contacts?.phone?.isTelegram,
            },
          },
        },
      });

      markSectionComplete('dados-recrutador');
      showSuccess(t('recruiterDataSuccess'));
    } catch {
      showError(t('recruiterDataError'));
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-2 backdrop-blur">
        <div className="grid gap-1 sm:grid-cols-2">
          {recruiterProfileSections.map((section) => {
            const Icon = section.icon;
            const isComplete = visibleProfileCompletionBySection[section.id];

            return (
              <a
                key={section.titleKey}
                href={`#${section.id}`}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-300 hover:bg-white/[0.03] ${
                  isComplete
                    ? 'text-lime-400 hover:text-lime-300'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{t(section.titleKey)}</span>
              </a>
            );
          })}
        </div>
      </div>

      <div id="dados-basicos" className={getSectionBoxClassName('dados-basicos')}>
        <ProfileSectionTitle
          title={t('basicData')}
          icon={FileText as never}
          onIconClick={() => setShowBasic((v) => !v)}
          iconClickable
          expanded={showBasic}
          titleClassName={sectionTitleClassName}
          iconClassName={sectionIconClassName}
          toggleIconClassName={sectionToggleIconClassName}
        />

        {showBasic && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Input
              label={t('name')}
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder={t('name')}
              {...register('name')}
            />

            <div className="hidden md:block" />

            <Input
              label={t('email')}
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder={t('email')}
              value={user?.email || ''}
              disabled
            />

            <Input
              label={t('birthday')}
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder={t('birthday')}
              value={formatBirthday(user?.birthday)}
              disabled
            />

            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<Save className="h-4 w-4" />}
                disabled={isSubmitting}
                onClick={handleSaveBasic}
                className={saveButtonClassName}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div id="dados-recrutador" className={getSectionBoxClassName('dados-recrutador')}>
        <ProfileSectionTitle
          title={t('recruiterData')}
          icon={UserRound as never}
          onIconClick={() => setShowRecruiter((v) => !v)}
          iconClickable
          expanded={showRecruiter}
          titleClassName={sectionTitleClassName}
          iconClassName={sectionIconClassName}
          toggleIconClassName={sectionToggleIconClassName}
        />

        {showRecruiter && (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Input
              label={t('company')}
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder={t('company')}
              {...register('recruiterProfile.tradeName')}
            />

            <div className="hidden lg:block" />
            <div className="hidden lg:block" />

            <Input
              label={t('position')}
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder={t('position')}
              {...register('recruiterProfile.position')}
            />

            <PhoneInput
              label={t('phone')}
              labelClassName={labelClassName}
              countryValue={phoneCountryValue || '+55'}
              numberValue={phoneNumberValue || ''}
              onCountryChange={(value) =>
                setValue('recruiterProfile.contacts.phone.country', value, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              onNumberChange={(value) =>
                setValue('recruiterProfile.contacts.phone.number', value, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />

            <div className="grid gap-3 self-end sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-lime-400"
                  {...register('recruiterProfile.contacts.phone.isWhatsapp')}
                />
                <MessageCircle className="h-5 w-5 text-lime-400" />
                <span>WhatsApp</span>
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-lime-400"
                  {...register('recruiterProfile.contacts.phone.isTelegram')}
                />
                <Send className="h-5 w-5 text-lime-400" />
                <span>Telegram</span>
              </label>
            </div>

            <div className="flex justify-end lg:col-span-3">
              <Button
                type="button"
                variant="positive"
                icon={<Save className="h-4 w-4" />}
                disabled={isSubmitting}
                onClick={handleSaveRecruiter}
                className={saveButtonClassName}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
