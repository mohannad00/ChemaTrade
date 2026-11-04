import { Languages, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/i18n/I18nProvider';
import type { MessageKey } from '@/i18n/messages.en';
import { ThemeToggle } from './ThemeToggle';
import { Wordmark } from './Wordmark';
import styles from './Header.module.css';

export const NAV_LINKS: readonly { to: string; label: MessageKey }[] = [
  { to: '/equipment', label: 'nav.equipment' },
  { to: '/maintenance', label: 'nav.maintenance' },
  { to: '/spare-parts', label: 'nav.spareParts' },
  { to: '/resources', label: 'nav.resources' },
  { to: '/about', label: 'nav.about' },
  { to: '/contact', label: 'nav.contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { t, toggleLang } = useI18n();
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
        <span className={styles.stripInner} data-short={` — ${t('header.demoShort')}`}>
          <strong>{t('header.demo')}</strong>
          <span className={styles.stripText}> — {t('header.demoText')}</span>
        </span>
      </div>
      <div className={`container ${styles.bar}`}>
        <Wordmark onNavigate={close} />
        <nav className={styles.nav} aria-label={t('header.primaryNav')}>
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
              {t(l.label)}
            </NavLink>
          ))}
        </nav>
        <div className={styles.tools}>
          <ThemeToggle />
          <button type="button" className={styles.lang} onClick={toggleLang} aria-label={t('lang.switchLabel')}>
            <Languages aria-hidden="true" />
            <span lang={t('lang.switchTo') === 'English' ? 'en' : 'ar'}>{t('lang.switchTo')}</span>
          </button>
          <div className={styles.cta}>
            <Button to="/request-quote" size="sm">{t('nav.requestQuote')}</Button>
          </div>
          <button type="button" className={styles.burger} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? t('header.closeMenu') : t('header.openMenu')} onClick={() => setOpen((o) => !o)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" className={styles.mobile} aria-label={t('header.mobileNav')}>
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? `${styles.mLink} ${styles.active}` : styles.mLink)} onClick={close}>
              {t(l.label)}
            </NavLink>
          ))}
          <NavLink to="/request-maintenance" className={styles.mLink} onClick={close}>{t('nav.requestMaintenance')}</NavLink>
          <div className={styles.mCta}>
            <Button to="/request-quote" onClick={close}>{t('nav.requestQuote')}</Button>
          </div>
        </nav>
      )}
    </header>
  );
}
