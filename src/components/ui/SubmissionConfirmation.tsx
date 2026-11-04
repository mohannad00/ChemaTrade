import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from './Button';
import styles from './SubmissionConfirmation.module.css';

interface Props {
  title: string;
  reference: string;
  summary: ReactNode;
  onAnother: () => void;
  anotherLabel: string;
  dashboardTo: string;
}

export function SubmissionConfirmation({ title, reference, summary, onAnother, anotherLabel, dashboardTo }: Props) {
  const { t } = useI18n();
  return (
    <section className={styles.box} aria-labelledby="confirm-h" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
      <CheckCircle2 aria-hidden="true" className={styles.icon} />
      <p className="eyebrow">{t('confirm.eyebrow')}</p>
      <h2 id="confirm-h">{title}</h2>
      <p className={styles.ref}>
        <span className="eyebrow">{t('confirm.reference')}</span>
        <strong className="mono" data-testid="demo-reference">{reference}</strong>
      </p>
      <div className={styles.summary}>{summary}</div>
      <p className={styles.warn}><strong>{t('confirm.notSent')}</strong> {t('demo.simulation')}</p>
      <p className={styles.warn}>{t('confirm.local1')} <Link to="/admin">{t('confirm.localLink')}</Link> {t('confirm.local2')}</p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onAnother}>{anotherLabel}</Button>
        <Button to={dashboardTo} variant="ghost">{t('confirm.viewDashboard')}</Button>
      </div>
    </section>
  );
}
