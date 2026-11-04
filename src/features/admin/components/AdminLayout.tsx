import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FileText, LayoutDashboard, ClipboardList, Package, RotateCcw, Wrench, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/Dialog';
import { Notice } from '@/components/ui/States';
import { APP_CONFIG } from '@/config/app.config';
import { invalidateData } from '@/lib/dataVersion';
import { sessionFlag } from '@/lib/storage';
import { services } from '@/services';
import { useDocumentTitle } from '@/hooks/common';
import { useI18n } from '@/i18n/I18nProvider';
import type { MessageKey } from '@/i18n/messages.en';
import styles from './AdminLayout.module.css';

const LINKS: readonly { to: string; label: MessageKey; icon: typeof Wrench; end: boolean }[] = [
  { to: '/admin', label: 'admin.nav.overview', icon: LayoutDashboard, end: true },
  { to: '/admin/equipment', label: 'admin.nav.equipment', icon: Package, end: false },
  { to: '/admin/quotations', label: 'admin.nav.quotations', icon: ClipboardList, end: false },
  { to: '/admin/maintenance', label: 'admin.nav.maintenance', icon: Wrench, end: false },
  { to: '/admin/content', label: 'admin.nav.content', icon: FileText, end: false },
];

/**
 * Demonstration-only gate. This is NOT security: it is client-side state that anyone can bypass.
 * Real authentication and authorisation must be enforced by a backend.
 */
function DemoGate({ onEnter }: { onEnter: () => void }) {
  const { t } = useI18n();
  useDocumentTitle(t('admin.gateEyebrow'));
  return (
    <section className={`container ${styles.gate}`}>
      <p className="eyebrow">{t('admin.gateEyebrow')}</p>
      <h1>{t('admin.gateTitle')}</h1>
      <p className="lede">{t('admin.gateLede')}</p>
      <Notice tone="demo" title={t('admin.gateNoticeTitle')}>{t('admin.gateNotice')}</Notice>
      <div><Button onClick={onEnter}>{t('admin.enter')}</Button></div>
    </section>
  );
}

export function AdminLayout() {
  const { t } = useI18n();
  const [entered, setEntered] = useState(() => sessionFlag.get(APP_CONFIG.demoSessionKey));
  const [confirmReset, setConfirmReset] = useState(false);
  const [busy, setBusy] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  if (!entered) {
    return <div className={styles.page}><DemoGate onEnter={() => { sessionFlag.set(APP_CONFIG.demoSessionKey, true); setEntered(true); }} /></div>;
  }

  const doReset = async () => {
    setBusy(true);
    try {
      await services.demo.resetDemoData();
      invalidateData();
      setResetDone(true);
    } finally {
      setBusy(false);
      setConfirmReset(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={`container ${styles.shell}`}>
        <aside className={styles.side}>
          <p className={styles.demo} role="status"><strong>{t('admin.badge')}</strong><span>{t('admin.badgeSub')}</span></p>
          <nav aria-label={t('admin.navLabel')}>
            <ul>
              {LINKS.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end} className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
                    <Icon aria-hidden="true" />{t(label)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.sideActions}>
            <Button variant="secondary" size="sm" icon={<RotateCcw aria-hidden="true" />} onClick={() => { setResetDone(false); setConfirmReset(true); }}>{t('admin.reset')}</Button>
            <Button variant="ghost" size="sm" icon={<LogOut aria-hidden="true" />} onClick={() => { sessionFlag.set(APP_CONFIG.demoSessionKey, false); setEntered(false); }}>{t('admin.leave')}</Button>
          </div>
        </aside>
        <section className={styles.main} aria-label={t('admin.region')}>
          {resetDone && <div role="status" className={styles.flash}>{t('admin.resetDone')}</div>}
          <Outlet />
        </section>
      </div>
      <ConfirmDialog
        open={confirmReset}
        title={t('admin.resetTitle')}
        message={<p>{t('admin.resetMessage')}</p>}
        confirmLabel={t('admin.reset')}
        busy={busy}
        onConfirm={doReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
