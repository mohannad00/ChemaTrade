import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Wordmark } from './Wordmark';
import styles from './Header.module.css';

export const NAV_LINKS = [
  { to: '/equipment', label: 'Equipment' },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/spare-parts', label: 'Spare Parts' },
  { to: '/resources', label: 'Resources' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={styles.strip} role="status">
        <span className={styles.stripInner}>
          <strong>Demo mode</strong>
          <span className={styles.stripText}> — frontend demonstration with sample content. Nothing is sent to Chema Trade.</span>
        </span>
      </div>
      <div className={`container ${styles.bar}`}>
        <Wordmark onNavigate={() => setOpen(false)} />
        <nav className={styles.nav} aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.cta}>
          <Button to="/request-quote" size="sm">Request a quote</Button>
        </div>
        <button type="button" className={styles.burger} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className={styles.mobile} aria-label="Mobile">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? `${styles.mLink} ${styles.active}` : styles.mLink)} onClick={close}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/request-maintenance" className={styles.mLink} onClick={close}>Request maintenance</NavLink>
          <div className={styles.mCta}>
            <Button to="/request-quote" onClick={close}>Request a quote</Button>
          </div>
        </nav>
      )}
    </header>
  );
}
