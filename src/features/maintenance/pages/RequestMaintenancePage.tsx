import { useState } from 'react';
import type { FormEvent } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/States';
import { SubmissionConfirmation } from '@/components/ui/SubmissionConfirmation';
import { SIMULATION_NOTICE } from '@/config/app.config';
import { useDocumentTitle } from '@/hooks/common';
import { invalidateData } from '@/lib/dataVersion';
import { hasErrors, type FieldErrors } from '@/lib/validation';
import { services } from '@/services';
import { toMaintenanceInput, validateMaintenance, type MaintenanceField, type MaintenanceFormValues } from '@/features/quotations/requestForms.logic';
import { MAINTENANCE_SERVICE_TYPES, MAINTENANCE_URGENCIES, type MaintenanceRequest } from '../maintenance.types';
import styles from '@/components/forms/RequestForm.module.css';

const EMPTY: MaintenanceFormValues = { fullName: '', organisation: '', email: '', phone: '', equipmentDescription: '', serviceType: '', urgency: 'Routine', details: '' };

export function RequestMaintenancePage() {
  useDocumentTitle('Request maintenance');
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
      <PageHeader eyebrow="Request maintenance" title="Describe the equipment and the problem" lede="Use this form to describe a service, repair, calibration or spare-part need. In this demo it is simulated: no booking is made and nothing reaches Chema Trade." demoTag />
      <div className={`container ${styles.wrap}`}>
        {done ? (
          <SubmissionConfirmation
            title="Maintenance request recorded (demo)"
            reference={done.reference}
            onAnother={reset}
            anotherLabel="Submit another demo request"
            dashboardTo="/admin/maintenance"
            summary={<p>{done.serviceType} — {done.equipmentDescription} ({done.urgency.toLowerCase()}). No appointment or visit has been booked.</p>}
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
            <TextField label="Equipment (type, make, model)" name="equipmentDescription" required value={values.equipmentDescription} onChange={set('equipmentDescription')} error={errors.equipmentDescription} />
            <div className={styles.row}>
              <SelectField label="Service type" name="serviceType" required value={values.serviceType} onChange={set('serviceType')} error={errors.serviceType} placeholder="Select a service" options={MAINTENANCE_SERVICE_TYPES.map((s) => ({ value: s, label: s }))} />
              <SelectField label="Urgency" name="urgency" required value={values.urgency} onChange={set('urgency')} error={errors.urgency} options={MAINTENANCE_URGENCIES.map((s) => ({ value: s, label: s }))} />
            </div>
            <TextAreaField label="Problem description" name="details" required value={values.details} onChange={set('details')} error={errors.details} hint="Symptoms, error messages, when it started, location." />
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

