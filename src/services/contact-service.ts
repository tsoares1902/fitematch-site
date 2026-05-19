export const CONTACT_TYPES = [
  'question',
  'suggestion',
  'criticism',
  'company_interest',
  'platform_issue',
  'other',
] as const;

export type ContactType = (typeof CONTACT_TYPES)[number];

export interface ContactMessageInput {
  name: string;
  email: string;
  type: ContactType;
  message: string;
}

export interface ContactValidationError {
  field: keyof ContactMessageInput;
  code: 'required' | 'invalidEmail' | 'invalidType' | 'messageTooShort';
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeContactMessage(input: ContactMessageInput): ContactMessageInput {
  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    type: input.type,
    message: input.message.trim(),
  };
}

export function validateContactMessage(input: ContactMessageInput) {
  const normalized = normalizeContactMessage(input);
  const errors: ContactValidationError[] = [];

  if (!normalized.name) {
    errors.push({ field: 'name', code: 'required' });
  }

  if (!normalized.email) {
    errors.push({ field: 'email', code: 'required' });
  } else if (!EMAIL_PATTERN.test(normalized.email)) {
    errors.push({ field: 'email', code: 'invalidEmail' });
  }

  if (!CONTACT_TYPES.includes(normalized.type)) {
    errors.push({ field: 'type', code: 'invalidType' });
  }

  if (!normalized.message) {
    errors.push({ field: 'message', code: 'required' });
  } else if (normalized.message.length < 10) {
    errors.push({ field: 'message', code: 'messageTooShort' });
  }

  return { data: normalized, errors };
}

export async function sendContactMessage(input: ContactMessageInput) {
  const { data, errors } = validateContactMessage(input);

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Contact webhook failed');
    }
  } else {
    console.info('Contact message received', {
      ...data,
      message: `${data.message.slice(0, 80)}${data.message.length > 80 ? '...' : ''}`,
    });
  }

  return { ok: true, errors: [] };
}
