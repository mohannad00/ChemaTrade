import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Button } from './Button';
import { SIMULATION_NOTICE } from '@/config/app.config';
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
  return (
    <section className={styles.box} aria-labelledby="confirm-h" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
      <CheckCircle2 aria-hidden="true" className={styles.icon} />
      <p className="eyebrow">Simulated submission</p>
      <h2 id="confirm-h">{title}</h2>
      <p className={styles.ref}>
        <span className="eyebrow">Demo reference</span>
        <strong className="mono" data-testid="demo-reference">{reference}</strong>
      </p>
      <div className={styles.summary}>{summary}</div>
      <p className={styles.warn}><strong>Not sent.</strong> {SIMULATION_NOTICE}</p>
      <p className={styles.warn}>This entry was added to the demo data in this browser only. You can see it in the <Link to="/admin">demo admin dashboard</Link> until you reset the demo data.</p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onAnother}>{anotherLabel}</Button>
        <Button to={dashboardTo} variant="ghost">View in demo dashboard</Button>
      </div>
    </section>
  );
}

