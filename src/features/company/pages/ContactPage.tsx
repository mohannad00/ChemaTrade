import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { TextAreaField, TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/States';
import { useDocumentTitle } from '@/hooks/common';
import { useI18n } from '@/i18n/I18nProvider';
import { emailError, hasErrors, minLength, required, type FieldErrors } from '@/lib/validation';
import styles from './CompanyPages.module.css';

interface Values { name: string; email: string; message: string }

export function ContactPage() {
  const { t } = useI18n();
  useDocumentTitle(t('nav.contact'));
  const [v, setV] = useState<Values>({ name: '', email: '', message: '' });
  const [errs, setErrs] = useState<FieldErrors<keyof Values>>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found: FieldErrors<keyof Values> = {
      name: required(v.name, 'field.name'),
      email: emailError(v.email),
      message: required(v.message, 'field.message') ?? minLength(v.message, 10, 'field.message'),
    };
    setErrs(found);
    if (hasErrors(found)) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setSent(true);
    }, 800);
  };

  return (
    <>
      <PageHeader eyebrow={t('contact.eyebrow')} title={t('contact.title')} lede={t('contact.lede')} demoTag />
      <div className={`container ${styles.contact}`}>
        <ul className={styles.details}>
          <li><Mail aria-hidden="true" /><div><span className="eyebrow">{t('field.email')}</span><p>{t('contact.placeholder')}</p></div></li>
          <li><Phone aria-hidden="true" /><div><span className="eyebrow">{t('contact.phoneLabel')}</span><p>{t('contact.placeholder')}</p></div></li>
          <li><MapPin aria-hidden="true" /><div><span className="eyebrow">{t('contact.address')}</span><p>{t('contact.placeholder')}</p></div></li>
        </ul>
        {sent ? (
          <section className={styles.sent} role="status" tabIndex={-1} ref={(el) => el?.focus()}>
            <h2>{t('contact.sentTitle')}</h2>
            <p><strong>{t('confirm.notSent')}</strong> {t('demo.simulation')}</p>
            <Button variant="secondary" onClick={() => { setSent(false); setV({ name: '', email: '', message: '' }); }}>{t('contact.another')}</Button>
          </section>
        ) : (
          <form className={styles.form} onSubmit={submit} noValidate aria-busy={busy}>
            <Notice tone="demo" title={t('quote.simTitle')}>{t('demo.simulation')}</Notice>
            <TextField label={t('field.name')} name="name" autoComplete="name" required value={v.name} error={errs.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
            <TextField label={t('field.email')} name="email" type="email" autoComplete="email" required value={v.email} error={errs.email} onChange={(e) => setV({ ...v, email: e.target.value })} />
            <TextAreaField label={t('field.message')} name="message" required value={v.message} error={errs.message} onChange={(e) => setV({ ...v, message: e.target.value })} />
            <div><Button type="submit" disabled={busy}>{busy ? t('contact.sending') : t('contact.send')}</Button></div>
          </form>
        )}
      </div>
    </>
  );
}
