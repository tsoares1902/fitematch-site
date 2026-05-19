'use client';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { FieldErrors, useForm, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import { BadgeCheck, Building2, Globe, Landmark, MapPin, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PhoneInput } from '@/components/form/phone-input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { useAddressByZipCode } from '@/hooks/use-address-by-zipcode';
import { useCompanyByCnpj } from '@/hooks/use-company-by-cnpj';
import { CompanyService } from '@/services/company/company.service';
import { ApiError } from '@/services/http/api-error';
import { UploadService } from '@/services/upload/upload.service';
import { CompanyEntity } from '@/types/entities/company.entity';

interface RecruiterCompanyFormValues {
  tradeName: string;
  legalName: string;
  email: string;
  website?: string;
  phoneCountry: string;
  phoneNumber: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  cnpj: string;
  logoUrl?: string;
}

function formatZipCode(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 14);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 5) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }

  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }

  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function SummaryCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur transition-all duration-300 hover:border-lime-500/20 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.05),0_18px_60px_rgba(0,0,0,0.28)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
          {icon}
        </div>
        <span className="text-xs uppercase tracking-[0.22em] text-zinc-600">{label}</span>
      </div>
      <p className="mt-6 truncate text-2xl font-semibold tracking-[-0.04em] text-zinc-50">
        {value}
      </p>
      <p className="mt-2 text-sm text-zinc-500">{helper}</p>
    </motion.div>
  );
}

function SectionCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <motion.fieldset
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34 }}
      className="rounded-2xl border border-zinc-800 bg-black/30 p-5"
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
          {icon}
        </div>
        <div>
          <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-100">
            {title}
          </legend>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>
      </div>
      {children}
    </motion.fieldset>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-40 rounded-2xl border border-zinc-800 bg-zinc-950/80"
          />
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur">
        <div className="space-y-5">
          <Skeleton className="h-8 w-56 rounded-xl bg-black/50" />
          <Skeleton className="h-28 rounded-2xl bg-black/50" />
          <Skeleton className="h-28 rounded-2xl bg-black/50" />
          <Skeleton className="h-28 rounded-2xl bg-black/50" />
        </div>
      </div>
    </div>
  );
}

export function RecruiterCompanyForm() {
  const t = useTranslations('RecruiterCompany');
  const { showSuccess, showError } = useFlashMessage();
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [hasCompany, setHasCompany] = useState(false);
  const {
    searchCompanyByCnpj,
    clearError: clearCnpjError,
    isLoading: isCnpjLoading,
    error: cnpjError,
  } = useCompanyByCnpj();
  const {
    searchZipCode,
    clearError: clearZipCodeError,
    isLoading: isZipCodeLoading,
    error: zipCodeError,
  } = useAddressByZipCode();

  const labelClassName = 'text-zinc-300';
  const fieldClassName =
    'rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 placeholder:text-zinc-500';

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RecruiterCompanyFormValues>({
    defaultValues: {
      phoneCountry: '+55',
      country: 'Brasil',
      state: 'SP',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const phoneCountryValue = useWatch({ control, name: 'phoneCountry' });
  const phoneNumberValue = useWatch({ control, name: 'phoneNumber' });
  const logoUrlValue = useWatch({ control, name: 'logoUrl' });
  const tradeNameValue = useWatch({ control, name: 'tradeName' });
  const cnpjValue = useWatch({ control, name: 'cnpj' });
  const cityValue = useWatch({ control, name: 'city' });
  const stateValue = useWatch({ control, name: 'state' });

  const summaryItems = useMemo(
    () => [
      {
        label: t('company'),
        value: tradeNameValue?.trim() || t('noTradeName'),
        helper: t('tradeNameHelper'),
        icon: <Building2 className="h-4 w-4" />,
      },
      {
        label: t('document'),
        value: cnpjValue?.trim() || t('cnpjNotProvided'),
        helper: t('documentHelper'),
        icon: <Landmark className="h-4 w-4" />,
      },
      {
        label: t('location'),
        value:
          cityValue?.trim() && stateValue?.trim()
            ? `${cityValue.trim()} - ${stateValue.trim()}`
            : t('locationNotDefined'),
        helper: t('locationHelper'),
        icon: <MapPin className="h-4 w-4" />,
      },
      {
        label: 'Status',
        value: hasCompany ? t('configured') : t('pending'),
        helper: hasCompany ? t('configuredHelper') : t('registerCompany'),
        icon: <BadgeCheck className="h-4 w-4" />,
      },
    ],
    [cityValue, cnpjValue, hasCompany, stateValue, t, tradeNameValue],
  );

  const reloadCompany = useCallback(
    async (options?: { silentNotFound?: boolean }) => {
      try {
        const company = await CompanyService.readMine();

        setHasCompany(true);
        reset(mapCompanyToFormValues(company));
      } catch (error) {
        if (error instanceof ApiError && error.statusCode === 404) {
          setHasCompany(false);

          if (options?.silentNotFound) {
            return;
          }
        }

        if (!(error instanceof ApiError && error.statusCode === 404 && options?.silentNotFound)) {
          showError(t('loadCompanyError'));
        }
      }
    },
    [reset, showError, t],
  );

  useEffect(() => {
    async function loadCompany() {
      try {
        await reloadCompany({ silentNotFound: true });
      } finally {
        setIsLoadingCompany(false);
      }
    }

    void loadCompany();
  }, [reloadCompany]);

  async function onSubmit(data: RecruiterCompanyFormValues) {
    const payload = {
      tradeName: data.tradeName,
      legalName: data.legalName,
      contacts: {
        email: data.email,
        website: data.website,
        phone: {
          country: data.phoneCountry,
          number: data.phoneNumber,
          isWhatsapp: true,
          isTelegram: false,
        },
        address: {
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          country: data.country,
          zipCode: data.zipCode,
        },
      },
      documents: {
        cnpj: data.cnpj,
        isVerified: false,
      },
      media: {
        logoUrl: data.logoUrl,
      },
    };

    try {
      await (hasCompany ? CompanyService.updateMine(payload) : CompanyService.createMine(payload));
      await reloadCompany();

      if (hasCompany) {
        showSuccess(t('updateSuccess'));
      } else {
        showSuccess(t('createSuccess'));
      }
    } catch {
      showError(hasCompany ? t('updateError') : t('createError'));
    }
  }

  function onInvalidSubmit(formErrors: FieldErrors<RecruiterCompanyFormValues>) {
    if (Object.keys(formErrors).length > 0) {
      showError(t('requiredFieldsError'));
    }
  }

  const zipCodeField = register('zipCode', {
    required: t('zipCodeRequired'),
    validate: (value) => value.replace(/\D/g, '').length === 8 || t('zipCodeInvalid'),
  });

  const cnpjField = register('cnpj', {
    required: t('cnpjRequired'),
    validate: (value) => value.replace(/\D/g, '').length === 14 || t('cnpjInvalid'),
  });

  async function handleCnpjLookup(cnpj?: string) {
    const result = await searchCompanyByCnpj(cnpj || '');

    if (!result) {
      return;
    }

    setValue('legalName', result.legalName, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue('tradeName', result.tradeName, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  async function handleZipCodeLookup(zipCode?: string) {
    const result = await searchZipCode(zipCode || '');

    if (!result) {
      return;
    }

    setValue('street', result.street, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue('neighborhood', result.neighborhood, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue('city', result.city, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue('state', result.state, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  if (isLoadingCompany) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => (
          <SummaryCard
            key={item.label}
            label={item.label}
            value={item.value}
            helper={item.helper}
            icon={item.icon}
          />
        ))}
      </section>

      {!hasCompany && !tradeNameValue && !cnpjValue && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur">
          <EmptyState message={t('empty')} />
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
        className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur"
      >
        <div className="mb-6 flex flex-col gap-4 border-b border-zinc-800 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3 text-zinc-100">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
                <Building2 className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-zinc-50">{t('companyData')}</h2>
                <p className="mt-1 text-sm text-zinc-500">{t('companyDataDescription')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SectionCard
            title={t('company')}
            description={t('companySectionDescription')}
            icon={<Building2 className="h-4 w-4" />}
          >
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FileUpload
                    label={t('companyLogo')}
                    accept="image/*"
                    value={logoUrlValue}
                    onUpload={async (file) => {
                      const response = await UploadService.uploadCompanyLogo(file);

                      setValue('logoUrl', response.url, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });

                      return response.url;
                    }}
                  />
                </div>
              </div>

              <input type="hidden" {...register('logoUrl')} />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Input
                      label="CNPJ"
                      labelClassName={labelClassName}
                      className={fieldClassName}
                      placeholder="00.000.000/0000-00"
                      error={errors.cnpj?.message}
                      {...cnpjField}
                      onChange={(event) => {
                        clearCnpjError();
                        const formattedValue = formatCnpj(event.target.value);

                        setValue('cnpj', formattedValue, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        });
                      }}
                      onBlur={(event) => {
                        cnpjField.onBlur(event);
                        void handleCnpjLookup(event.target.value);
                      }}
                    />
                  </div>
                  <div className="hidden md:block" />
                </div>
              </div>

              {isCnpjLoading && (
                <div className="rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 text-sm text-zinc-400">
                  {t('checkingCnpj')}
                </div>
              )}

              {cnpjError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {cnpjError}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label={t('tradeName')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  error={errors.tradeName?.message}
                  {...register('tradeName', {
                    required: t('tradeNameRequired'),
                    validate: (value) => value.trim().length > 0 || t('tradeNameRequired'),
                  })}
                />

                <Input
                  label={t('legalName')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  error={errors.legalName?.message}
                  {...register('legalName', {
                    required: t('legalNameRequired'),
                    validate: (value) => value.trim().length > 0 || t('legalNameRequired'),
                  })}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title={t('contact')}
            description={t('contactDescription')}
            icon={<Globe className="h-4 w-4" />}
          >
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <input type="hidden" {...register('phoneCountry')} />
                  <input
                    type="hidden"
                    {...register('phoneNumber', {
                      required: t('phoneRequired'),
                      validate: (value) =>
                        value.replace(/\D/g, '').length >= 8 || t('phoneRequired'),
                    })}
                  />
                  <PhoneInput
                    labelClassName={labelClassName}
                    countryValue={phoneCountryValue || '+55'}
                    numberValue={phoneNumberValue || ''}
                    onCountryChange={(value) =>
                      setValue('phoneCountry', value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    onNumberChange={(value) =>
                      setValue('phoneNumber', value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    error={errors.phoneNumber?.message}
                  />
                </div>
                <div className="hidden md:block" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label={t('email')}
                  labelClassName={labelClassName}
                  type="email"
                  className={fieldClassName}
                  error={errors.email?.message}
                  {...register('email', {
                    required: t('emailRequired'),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t('emailInvalid'),
                    },
                  })}
                />

                <Input
                  label={t('website')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="https://suaempresa.com.br"
                  {...register('website')}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title={t('address')}
            description={t('addressDescription')}
            icon={<MapPin className="h-4 w-4" />}
          >
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Input
                      label={t('zipCode')}
                      labelClassName={labelClassName}
                      className={fieldClassName}
                      placeholder="01310-100"
                      error={errors.zipCode?.message}
                      {...zipCodeField}
                      onChange={(event) => {
                        clearZipCodeError();
                        const formattedValue = formatZipCode(event.target.value);

                        setValue('zipCode', formattedValue, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        });
                      }}
                      onBlur={(event) => {
                        zipCodeField.onBlur(event);
                        void handleZipCodeLookup(event.target.value);
                      }}
                    />
                  </div>
                  <div className="hidden md:block" />
                </div>
              </div>

              {isZipCodeLoading && (
                <div className="rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 text-sm text-zinc-400">
                  {t('checkingZipCode')}
                </div>
              )}

              {zipCodeError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {zipCodeError}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label={t('street')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  error={errors.street?.message}
                  {...register('street', {
                    required: t('streetRequired'),
                    validate: (value) => value.trim().length > 0 || t('streetRequired'),
                  })}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label={t('number')}
                    labelClassName={labelClassName}
                    className={fieldClassName}
                    error={errors.number?.message}
                    {...register('number', {
                      required: t('numberRequired'),
                      validate: (value) => value.trim().length > 0 || t('numberRequired'),
                    })}
                  />

                  <Input
                    label={t('complement')}
                    labelClassName={labelClassName}
                    className={fieldClassName}
                    {...register('complement')}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label={t('neighborhood')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  error={errors.neighborhood?.message}
                  {...register('neighborhood', {
                    required: t('neighborhoodRequired'),
                    validate: (value) => value.trim().length > 0 || t('neighborhoodRequired'),
                  })}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label={t('city')}
                    labelClassName={labelClassName}
                    className={fieldClassName}
                    error={errors.city?.message}
                    {...register('city', {
                      required: t('cityRequired'),
                      validate: (value) => value.trim().length > 0 || t('cityRequired'),
                    })}
                  />

                  <Input
                    label={t('state')}
                    labelClassName={labelClassName}
                    className={fieldClassName}
                    error={errors.state?.message}
                    {...register('state', {
                      required: t('stateRequired'),
                      validate: (value) => value.trim().length > 0 || t('stateRequired'),
                    })}
                  />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="mt-6 flex justify-end border-t border-zinc-800 pt-6">
          <Button
            type="submit"
            variant="positive"
            icon={<Save className="h-4 w-4" />}
            disabled={isSubmitting}
            className="rounded-xl border-lime-500/20 bg-lime-500/10 px-5 py-2.5 text-lime-300 hover:bg-lime-500/15"
          >
            {isSubmitting ? t('saving') : hasCompany ? t('updateCompany') : t('saveCompany')}
          </Button>
        </div>
      </form>
    </div>
  );
}

function mapCompanyToFormValues(company: CompanyEntity): RecruiterCompanyFormValues {
  return {
    tradeName: company.tradeName || '',
    legalName: company.legalName || '',
    email: company.contacts?.email || '',
    website: company.contacts?.website || '',
    phoneCountry: company.contacts?.phone?.country || '+55',
    phoneNumber: company.contacts?.phone?.number || '',
    street: company.contacts?.address?.street || '',
    number: company.contacts?.address?.number || '',
    complement: company.contacts?.address?.complement || '',
    neighborhood: company.contacts?.address?.neighborhood || '',
    city: company.contacts?.address?.city || '',
    state: company.contacts?.address?.state || 'SP',
    country: company.contacts?.address?.country || 'Brasil',
    zipCode: formatZipCode(company.contacts?.address?.zipCode || ''),
    cnpj: formatCnpj(company.documents?.cnpj || ''),
    logoUrl: company.media?.logoUrl || '',
  };
}
