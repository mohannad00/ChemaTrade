import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cx } from '@/lib/cx';
import styles from './Field.module.css';

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function Wrapper({ id, label, error, hint, required, children }: BaseProps & { id: string; children: ReactNode }) {
  return (
    <div className={cx(styles.field, error && styles.invalid)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.req} aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className={styles.hint}>{hint}</p>}
      {error && <p id={`${id}-err`} className={styles.error} role="alert">{error}</p>}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-err`;
  return hint ? `${id}-hint` : undefined;
}

type TextFieldProps = BaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>;
export function TextField({ label, error, hint, required, className, ...rest }: TextFieldProps) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} required={required}>
      <input id={id} name={rest.name} className={cx(styles.control, className)} aria-invalid={!!error} aria-required={required} aria-describedby={describedBy(id, error, hint)} {...rest} />
    </Wrapper>
  );
}

type TextAreaProps = BaseProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>;
export function TextAreaField({ label, error, hint, required, className, ...rest }: TextAreaProps) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} required={required}>
      <textarea id={id} rows={5} className={cx(styles.control, styles.area, className)} aria-invalid={!!error} aria-required={required} aria-describedby={describedBy(id, error, hint)} {...rest} />
    </Wrapper>
  );
}

export interface Option {
  value: string;
  label: string;
}
type SelectProps = BaseProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & { options: readonly Option[]; placeholder?: string };
export function SelectField({ label, error, hint, required, options, placeholder, className, ...rest }: SelectProps) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} required={required}>
      <select id={id} className={cx(styles.control, styles.select, className)} aria-invalid={!!error} aria-required={required} aria-describedby={describedBy(id, error, hint)} {...rest}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Wrapper>
  );
}

type CheckboxProps = { label: string } & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'>;
export function CheckboxField({ label, ...rest }: CheckboxProps) {
  const id = useId();
  return (
    <div className={styles.check}>
      <input id={id} type="checkbox" {...rest} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
