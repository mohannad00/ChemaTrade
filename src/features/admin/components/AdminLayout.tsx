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
import styles from './AdminLayout.module.css';

const LINKS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/equipment', label: 'Equipment', icon: Package, end: false },
  { to: '/admin/quotations', label: 'Quotations', icon: ClipboardList, end: false },
  { to: '/admin/maintenance', label: 'Maintenance', icon: Wrench, end: false },
  { to: '/admin/content', label: 'Content', icon: FileText, end: false },
] as const;

/**
 * Demonstration-only gate. This is NOT security: it is client-side state that anyone can bypass.
 * Real authentication and authorisation must be enforced by a backend.
 */
function DemoGate({ onEnter }: { onEnter: () => void }) {
  useDocumentTitle('Demo admin');
  return (
    <section className={`container ${styles.gate}`}>
      <p className="eyebrow">Demo admin dashboard</p>
      <h1>Demonstration only</h1>
      <p className="lede">This dashboard demonstrates a future admin interface using sample data stored in your browser.</p>
      <Notice tone="demo" title="Not a real login">There are no accounts and no passwords. This button is a demonstration-only flow and provides no security. A production dashboard needs real authentication enforced by a backend.</Notice>
      <div><Button onClick={onEnter}>Enter demo dashboard</Button></div>
    </section>
  );
}

export function AdminLayout() {
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
          <p className={styles.demo} role="status"><strong>DEMO MODE</strong><span>Sample data · local only</span></p>
          <nav aria-label="Admin">
            <ul>
              {LINKS.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end} className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
                    <Icon aria-hidden="true" />{label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.sideActions}>
            <Button variant="secondary" size="sm" icon={<RotateCcw aria-hidden="true" />} onClick={() => { setResetDone(false); setConfirmReset(true); }}>Reset demo data</Button>
            <Button variant="ghost" size="sm" icon={<LogOut aria-hidden="true" />} onClick={() => { sessionFlag.set(APP_CONFIG.demoSessionKey, false); setEntered(false); }}>Leave demo admin</Button>
          </div>
        </aside>
        <section className={styles.main} aria-label="Admin content">
          {resetDone && <div role="status" className={styles.flash}>Demo data was reset to the original samples.</div>}
          <Outlet />
        </section>
      </div>
      <ConfirmDialog
        open={confirmReset}
        title="Reset demo data?"
        message={<p>This restores all sample equipment, articles and requests, and removes anything you added, edited or deleted, including requests submitted from the public forms. This only affects this browser.</p>}
        confirmLabel="Reset demo data"
        busy={busy}
        onConfirm={doReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
