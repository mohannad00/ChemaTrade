import { useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/States';
import { SubmissionConfirmation } from '@/components/ui/SubmissionConfirmation';
import { useI18n } from '@/i18n/I18nProvider';
import { useLocalizedList } from '@/i18n/useLocalized';
import { useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { invalidateData } from '@/lib/dataVersion';
import { hasErrors, type FieldErrors } from '@/lib/validation';
import { services } from '@/services';
import { toQuotationInput, validateQuotation, type QuotationField, type QuotationFormValues } from '../requestForms.logic';
import type { QuotationRequest } from '../quotations.types';
import styles from '@/components/forms/RequestForm.module.css';

const EMPTY: QuotationFormValues = { fullName: '', organisation: '', email: '', phone: '', equipmentSlug: '', quantity: '1', details: '' };

export function RequestQuotationPage() {
  const { t, te } = useI18n();
  useDocumentTitle(t('quote.eyebrow'));
  const [params] = useSearchParams();
  const equipmentQ = useQuery(() => services.equipment.list(), []);
  const equipment = { ...equipmentQ, data: useLocalizedList(equipmentQ.data) };
  const [values, setValues] = useState<QuotationFormValues>({ ...EMPTY, equipmentSlug: params.get('equipment') ?? '' });
  const [errors, setErrors] = useState<FieldErrors<QuotationField>>({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [done, setDone] = useState<QuotationRequest | null>(null);

  const set = (k: QuotationField) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateQuotation(values);
    setErrors(found);
    if (hasErrors(found)) {
      const first = (Object.keys(found) as QuotationField[]).find((k) => found[k]);
      document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    setFailure(null);
    try {
      const name = equipmentQ.data?.find((x) => x.slug === values.equipmentSlug)?.name ?? '';
      const created = await services.quotations.create(toQuotationInput(values, name));
      invalidateData();
      setDone(created);
    } catch (err) {
      setFailure(err instanceof Error ? err.message : t('quote.failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setDone(null);
    setValues(EMPTY);
    setErrors({});
  };

  return (
    <>
      <PageHeader eyebrow={t('quote.eyebrow')} title={t('quote.title')} lede={t('quote.lede')} demoTag />
      <div className={`container ${styles.wrap}`}>
        {done ? (
          <SubmissionConfirmation
            title={t('quote.doneTitle')}
            reference={done.reference}
            onAnother={reset}
            anotherLabel={t('quote.another')}
            dashboardTo="/admin/quotations"
            summary={<p>{t('quote.doneSummary', { qty: done.quantity, equipment: done.equipmentSlug ? (equipment.data?.find((x) => x.slug === done.equipmentSlug)?.name ?? done.equipmentName) : te('misc', done.equipmentName), org: done.organisation })}</p>}
          />
        ) : (
          <form className={styles.form} onSubmit={submit} noValidate aria-busy={submitting}>
            <Notice tone="demo" title={t('quote.simTitle')}>{t('demo.simulation')}</Notice>
            <div className={styles.row}>
              <TextField label={t('field.fullName')} name="fullName" autoComplete="name" required value={values.fullName} onChange={set('fullName')} error={errors.fullName} />
              <TextField label={t('field.organisation')} name="organisation" autoComplete="organization" required value={values.organisation} onChange={set('organisation')} error={errors.organisation} />
            </div>
            <div className={styles.row}>
              <TextField label={t('field.email')} name="email" type="email" autoComplete="email" required value={values.email} onChange={set('email')} error={errors.email} />
              <TextField label={t('field.phone')} name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set('phone')} />
            </div>
            <div className={styles.row}>
              <SelectField label={t('quote.equipmentOfInterest')} name="equipmentSlug" value={values.equipmentSlug} onChange={set('equipmentSlug')} placeholder={t('quote.general')} options={(equipment.data ?? []).map((x) => ({ value: x.slug, label: x.name }))} hint={equipment.status === 'loading' ? t('quote.loadingCatalog') : t('quote.catalogHint')} />
              <TextField label={t('field.quantity')} name="quantity" type="number" inputMode="numeric" min={1} max={9999} required value={values.quantity} onChange={set('quantity')} error={errors.quantity} />
            </div>
            <TextAreaField label={t('field.requirements')} name="details" required value={values.details} onChange={set('details')} error={errors.details} hint={t('quote.requirementsHint')} />
            {failure && <p role="alert" className={styles.failure}>{failure}</p>}
            <div className={styles.actions}>
              <Button type="submit" disabled={submitting}>{submitting ? t('quote.submitting') : t('quote.submit')}</Button>
              <span aria-hidden="true">{t('common.requiredNote')}</span>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

