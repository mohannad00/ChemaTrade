import type { MessageKey } from '@/i18n/messages.en';

/** A validation problem expressed as message data so the UI can translate it. */
export interface FieldError {
  key: MessageKey;
  labelKey?: MessageKey;
  n?: number;
}

export type FieldErrors<K extends string> = Partial<Record<K, FieldError>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(v: string): boolean {
  return EMAIL_RE.test(v.trim());
}

export function required(v: string, labelKey: MessageKey): FieldError | undefined {
  return v.trim() ? undefined : { key: 'validation.required', labelKey };
}

export function minLength(v: string, n: number, labelKey: MessageKey): FieldError | undefined {
  return v.trim().length >= n ? undefined : { key: 'validation.minLength', labelKey, n };
}

export function emailError(v: string, labelKey: MessageKey = 'field.email'): FieldError | undefined {
  return required(v, labelKey) ?? (isEmail(v) ? undefined : { key: 'validation.email' });
}

export function hasErrors(e: object): boolean {
  return Object.values(e).some(Boolean);
}
