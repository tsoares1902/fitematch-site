'use server';

import {
  CONTACT_TYPES,
  sendContactMessage,
  type ContactMessageInput,
  type ContactValidationError,
} from '@/services/contact-service';

export interface ContactActionState {
  ok: boolean;
  errors: ContactValidationError[];
}

function getContactType(value: FormDataEntryValue | null): ContactMessageInput['type'] {
  return CONTACT_TYPES.includes(value as ContactMessageInput['type'])
    ? (value as ContactMessageInput['type'])
    : 'other';
}

export async function submitContactAction(formData: FormData): Promise<ContactActionState> {
  const input: ContactMessageInput = {
    name: String(formData.get('name') || ''),
    email: String(formData.get('email') || ''),
    type: getContactType(formData.get('type')),
    message: String(formData.get('message') || ''),
  };

  try {
    return await sendContactMessage(input);
  } catch {
    return { ok: false, errors: [] };
  }
}
