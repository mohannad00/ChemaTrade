import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { TextAreaField, TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/States';
import { SIMULATION_NOTICE } from '@/config/app.config';
import { useDocumentTitle } from '@/hooks/common';
import { hasErrors, isEmail, minLength, required } from '@/lib/validation';
import styles from './CompanyPages.module.css';

interface Values { name: string; email: string; message: string }
type Errs = Partial<Record<keyof Values, string>>;

export function ContactPage() {
  useDocumentTitle('Contact');
  const [v, setV] = useState<Values>({ name: '', email: '', message: '' });
  const [errs, setErrs] = useState<Errs>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found: Errs = {
      name: required(v.name, 'Name'),
      email: required(v.email, 'Email') ?? (isEmail(v.email) ? undefined : 'Enter a valid email address.'),
      message: required(v.message, 'Message') ?? minLength(v.message, 10, 'Message'),
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
      <PageHeader eyebrow="Contact" title="Get in touch" lede="Contact details are placeholders in this demo. Use the quotation or maintenance forms for specific requests." demoTag />
      <div className={`container ${styles.contact}`}>
        <ul className={styles.details}>
          <li><Mail aria-hidden="true" /><div><span className="eyebrow">Email</span><p className="mono">[to be provided by Chema Trade]</p></div></li>
          <li><Phone aria-hidden="true" /><div><span className="eyebrow">Phone</span><p className="mono">[to be provided by Chema Trade]</p></div></li>
          <li><MapPin aria-hidden="true" /><div><span className="eyebrow">Address</span><p className="mono">[to be provided by Chema Trade]</p></div></li>
        </ul>
        {sent ? (
          <section className={styles.sent} role="status" tabIndex={-1} ref={(el) => el?.focus()}>
            <h2>Message recorded (demo)</h2>
            <p className="mono"><strong>Not sent.</strong> {SIMULATION_NOTICE}</p>
            <Button variant="secondary" onClick={() => { setSent(false); setV({ name: '', email: '', message: '' }); }}>Write another</Button>
          </section>
        ) : (
          <form className={styles.form} onSubmit={submit} noValidate aria-busy={busy}>
            <Notice tone="demo" title="Simulated form">{SIMULATION_NOTICE}</Notice>
            <TextField label="Name" name="name" autoComplete="name" required value={v.name} error={errs.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
            <TextField label="Email" name="email" type="email" autoComplete="email" required value={v.email} error={errs.email} onChange={(e) => setV({ ...v, email: e.target.value })} />
            <TextAreaField label="Message" name="message" required value={v.message} error={errs.message} onChange={(e) => setV({ ...v, message: e.target.value })} />
            <div><Button type="submit" disabled={busy}>{busy ? 'Sending (simulated)…' : 'Send demo message'}</Button></div>
          </form>
        )}
      </div>
    </>
  );
}
