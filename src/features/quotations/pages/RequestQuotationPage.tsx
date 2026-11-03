import { useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/States';
import { SubmissionConfirmation } from '@/components/ui/SubmissionConfirmation';
import { SIMULATION_NOTICE } from '@/config/app.config';
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
  useDocumentTitle('Request a quotation');
  const [params] = useSearchParams();
  const equipment = useQuery(() => services.equipment.list(), []);
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
      const name = equipment.data?.find((x) => x.slug === values.equipmentSlug)?.name ?? '';
      const created = await services.quotations.create(toQuotationInput(values, name));
      invalidateData();
      setDone(created);
    } catch (err) {
      setFailure(err instanceof Error ? err.message : 'Submission failed.');
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
      <PageHeader eyebrow="Request a quotation" title="Tell us what you need" lede="Describe the equipment and your requirements. In this demo the form is simulated: it will not reach Chema Trade." demoTag />
      <div className={`container ${styles.wrap}`}>
        {done ? (
          <SubmissionConfirmation
            title="Quotation request recorded (demo)"
            reference={done.reference}
            onAnother={reset}
            anotherLabel="Submit another demo request"
            dashboardTo="/admin/quotations"
            summary={<p>{done.quantity} × {done.equipmentName} for {done.organisation}. In a live system Chema Trade would review the request and reply by the contact details provided.</p>}
          />
        ) : (
          <form className={styles.form} onSubmit={submit} noValidate aria-busy={submitting}>
            <Notice tone="demo" title="Simulated form">{SIMULATION_NOTICE}</Notice>
            <div className={styles.row}>
              <TextField label="Full name" name="fullName" autoComplete="name" required value={values.fullName} onChange={set('fullName')} error={errors.fullName} />
              <TextField label="Organisation" name="organisation" autoComplete="organization" required value={values.organisation} onChange={set('organisation')} error={errors.organisation} />
            </div>
            <div className={styles.row}>
              <TextField label="Email" name="email" type="email" autoComplete="email" required value={values.email} onChange={set('email')} error={errors.email} />
              <TextField label="Phone (optional)" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set('phone')} />
            </div>
            <div className={styles.row}>
              <SelectField label="Equipment of interest" name="equipmentSlug" value={values.equipmentSlug} onChange={set('equipmentSlug')} placeholder="General enquiry / not listed" options={(equipment.data ?? []).map((x) => ({ value: x.slug, label: x.name }))} hint={equipment.status === 'loading' ? 'Loading sample catalog…' : 'Sample catalog items only.'} />
              <TextField label="Quantity" name="quantity" type="number" inputMode="numeric" min={1} max={9999} required value={values.quantity} onChange={set('quantity')} error={errors.quantity} />
            </div>
            <TextAreaField label="Requirements" name="details" required value={values.details} onChange={set('details')} error={errors.details} hint="Application, capacity or range, standards, delivery location, timeline." />
            {failure && <p role="alert" className={styles.failure}>{failure}</p>}
            <div className={styles.actions}>
              <Button type="submit" disabled={submitting}>{submitting ? 'Submitting (simulated)…' : 'Submit demo request'}</Button>
              <span className="mono" aria-hidden="true">* required</span>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

