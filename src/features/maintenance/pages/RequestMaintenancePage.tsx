import { useState } from 'react';
import type { FormEvent } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/States';
import { SubmissionConfirmation } from '@/components/ui/SubmissionConfirmation';
import { useI18n } from '@/i18n/I18nProvider';
import { useDocumentTitle } from '@/hooks/common';
import { invalidateData } from '@/lib/dataVersion';
import { hasErrors, type FieldErrors } from '@/lib/validation';
import { services } from '@/services';
import { toMaintenanceInput, validateMaintenance, type MaintenanceField, type MaintenanceFormValues } from '@/features/quotations/requestForms.logic';
import { MAINTENANCE_SERVICE_TYPES, MAINTENANCE_URGENCIES, type MaintenanceRequest } from '../maintenance.types';
import styles from '@/components/forms/RequestForm.module.css';

const EMPTY: MaintenanceFormValues = { fullName: '', organisation: '', email: '', phone: '', equipmentDescription: '', serviceType: '', urgency: 'Routine', details: '' };

export function RequestMaintenancePage() {
  const { t, te } = useI18n();
  useDocumentTitle(t('mreq.eyebrow'));
  const [values, setValues] = useState<MaintenanceFormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<MaintenanceField>>({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [done, setDone] = useState<MaintenanceRequest | null>(null);

  const set = (k: MaintenanceField) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateMaintenance(values);
    setErrors(found);
    if (hasErrors(found)) {
      const first = (Object.keys(found) as MaintenanceField[]).find((k) => found[k]);
      document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    setFailure(null);
    try {
      const created = await services.maintenance.create(toMaintenanceInput(values));
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
      <PageHeader eyebrow={t('mreq.eyebrow')} title={t('mreq.title')} lede={t('mreq.lede')} demoTag />
      <div className={`container ${styles.wrap}`}>
        {done ? (
          <SubmissionConfirmation
            title={t('mreq.doneTitle')}
            reference={done.reference}
            onAnother={reset}
            anotherLabel={t('quote.another')}
            dashboardTo="/admin/maintenance"
            summary={<p>{t('mreq.doneSummary', { service: te('service', done.serviceType), equipment: done.equipmentDescription, urgency: te('status', done.urgency) })}</p>}
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
            <TextField label={t('field.equipment')} name="equipmentDescription" required value={values.equipmentDescription} onChange={set('equipmentDescription')} error={errors.equipmentDescription} />
            <div className={styles.row}>
              <SelectField label={t('field.serviceType')} name="serviceType" required value={values.serviceType} onChange={set('serviceType')} error={errors.serviceType} placeholder={t('mreq.selectService')} options={MAINTENANCE_SERVICE_TYPES.map((s) => ({ value: s, label: te('service', s) }))} />
              <SelectField label={t('field.urgency')} name="urgency" required value={values.urgency} onChange={set('urgency')} error={errors.urgency} options={MAINTENANCE_URGENCIES.map((s) => ({ value: s, label: te('status', s) }))} />
            </div>
            <TextAreaField label={t('field.problem')} name="details" required value={values.details} onChange={set('details')} error={errors.details} hint={t('mreq.problemHint')} />
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

