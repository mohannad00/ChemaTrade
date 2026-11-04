import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/common';
import { useI18n } from '@/i18n/I18nProvider';
import styles from './CompanyPages.module.css';

export function NotFoundContent({ title, message, backTo, backLabel }: { title: string; message: string; backTo: string; backLabel: string }) {
  const { t } = useI18n();
  useDocumentTitle(title);
  return (
    <section className={`container ${styles.nf}`}>
      <p className="eyebrow">404</p>
      <h1>{title}</h1>
      <p className="lede">{message}</p>
      <div className={styles.nfActions}>
        <Button to={backTo} variant="secondary">{backLabel}</Button>
        <Link to="/">{t('common.homeLink')}</Link>
      </div>
    </section>
  );
}

export function NotFoundPage() {
  const { t } = useI18n();
  return <NotFoundContent title={t('nf.title')} message={t('nf.message')} backTo="/" backLabel={t('nf.back')} />;
}
