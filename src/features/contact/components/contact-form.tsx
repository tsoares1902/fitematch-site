'use client';

import { useState, useTransition } from 'react';
import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { submitContactAction } from '@/actions/contact-action';
import {
  CONTACT_TYPES,
  validateContactMessage,
  type ContactMessageInput,
  type ContactValidationError,
} from '@/services/contact-service';

type ContactFormValues = Record<keyof ContactMessageInput, string>;

const initialValues: ContactFormValues = {
  name: '',
  email: '',
  type: 'question',
  message: '',
};

function getFieldErrors(errors: ContactValidationError[], t: ReturnType<typeof useTranslations>) {
  return errors.reduce<Partial<Record<keyof ContactMessageInput, string>>>((acc, error) => {
    acc[error.field] = t(`validation.${error.code}`);
    return acc;
  }, {});
}

export function ContactForm() {
  const t = useTranslations('contact');
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactMessageInput, string>>>({});
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField(field: keyof ContactFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFeedback(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const input = {
      ...values,
      type: values.type as ContactMessageInput['type'],
    };
    const validation = validateContactMessage(input);

    if (validation.errors.length > 0) {
      setErrors(getFieldErrors(validation.errors, t));
      return;
    }

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await submitContactAction(formData);

      if (result.ok) {
        setValues(initialValues);
        setErrors({});
        setFeedback('success');
        return;
      }

      setErrors(getFieldErrors(result.errors, t));
      setFeedback('error');
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur"
      noValidate
    >
      <div className="grid gap-5">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium text-zinc-100">
            {t('form.name')}
          </label>
          <input
            id="contact-name"
            name="name"
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-lime-500"
            placeholder={t('form.namePlaceholder')}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            disabled={isPending}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-2 text-sm text-red-300">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="text-sm font-medium text-zinc-100">
            {t('form.email')}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-lime-500"
            placeholder={t('form.emailPlaceholder')}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            disabled={isPending}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-2 text-sm text-red-300">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-type" className="text-sm font-medium text-zinc-100">
            {t('form.type')}
          </label>
          <select
            id="contact-type"
            name="type"
            value={values.type}
            onChange={(event) => updateField('type', event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-100 outline-none transition-colors focus:border-lime-500"
            aria-invalid={Boolean(errors.type)}
            aria-describedby={errors.type ? 'contact-type-error' : undefined}
            disabled={isPending}
          >
            {CONTACT_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`form.types.${type}`)}
              </option>
            ))}
          </select>
          {errors.type && (
            <p id="contact-type-error" className="mt-2 text-sm text-red-300">
              {errors.type}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-message" className="text-sm font-medium text-zinc-100">
            {t('form.message')}
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={values.message}
            onChange={(event) => updateField('message', event.target.value)}
            className="mt-2 min-h-40 w-full resize-y rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm leading-6 text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-lime-500"
            placeholder={t('form.messagePlaceholder')}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            disabled={isPending}
          />
          {errors.message && (
            <p id="contact-message-error" className="mt-2 text-sm text-red-300">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {feedback && (
        <p
          className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
            feedback === 'success'
              ? 'border-lime-500/30 bg-lime-500/10 text-lime-200'
              : 'border-red-500/30 bg-red-500/10 text-red-200'
          }`}
          role="status"
        >
          {t(`feedback.${feedback}`)}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime-500 px-5 py-3 text-sm font-medium text-black transition-all hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <Send className="h-4 w-4" />
          {isPending ? t('form.sending') : t('form.submit')}
        </button>
      </div>
    </form>
  );
}
