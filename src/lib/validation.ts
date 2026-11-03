export type FieldErrors<K extends string> = Partial<Record<K, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(v: string): boolean {
  return EMAIL_RE.test(v.trim());
}

export function required(v: string, label: string): string | undefined {
  return v.trim() ? undefined : `${label} is required.`;
}

export function minLength(v: string, n: number, label: string): string | undefined {
  return v.trim().length >= n ? undefined : `${label} must be at least ${n} characters.`;
}

export function hasErrors(e: object): boolean {
  return Object.values(e).some(Boolean);
}
