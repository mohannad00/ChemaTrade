import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { Button } from './Button';
import styles from './Dialog.module.css';

interface DialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

/** Native <dialog>: focus trapping, Escape handling and inert background come from the platform. */
export function Dialog({ open, title, onClose, children, footer, wide }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`${styles.dialog} ${wide ? styles.wide : ''}`}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {open && (
        <div className={styles.inner}>
          <header className={styles.head}>
            <h2 id={titleId}>{title}</h2>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close dialog">
              <X aria-hidden="true" />
            </button>
          </header>
          <div className={styles.body}>{children}</div>
          {footer && <footer className={styles.foot}>{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}

interface ConfirmProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel, busy, onConfirm, onCancel }: ConfirmProps) {
  return (
    <Dialog
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={busy}>{busy ? 'Working…' : confirmLabel}</Button>
        </>
      }
    >
      <div>{message}</div>
    </Dialog>
  );
}
