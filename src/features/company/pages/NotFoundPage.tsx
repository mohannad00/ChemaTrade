import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/common';
import styles from './CompanyPages.module.css';

export function NotFoundContent({ title, message, backTo, backLabel }: { title: string; message: string; backTo: string; backLabel: string }) {
  useDocumentTitle(title);
  return (
    <section className={`container ${styles.nf}`}>
      <p className="eyebrow">404</p>
      <h1>{title}</h1>
      <p className="lede">{message}</p>
      <div className={styles.nfActions}>
        <Button to={backTo} variant="secondary">{backLabel}</Button>
        <Link to="/">Go to the home page</Link>
      </div>
    </section>
  );
}

export function NotFoundPage() {
  return <NotFoundContent title="Page not found" message="That address does not exist in this demo." backTo="/" backLabel="Back to home" />;
}
