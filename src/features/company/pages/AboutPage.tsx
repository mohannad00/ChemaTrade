import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/States';
import { useDocumentTitle } from '@/hooks/common';
import { useI18n } from '@/i18n/I18nProvider';
import styles from './CompanyPages.module.css';

export function AboutPage() {
  const { t } = useI18n();
  useDocumentTitle(t('nav.about'));
  return (
    <>
      <PageHeader eyebrow={t('about.eyebrow')} title={t('about.title')} lede={t('about.lede')} demoTag />
      <div className={`container ${styles.wrap}`}>
        <div className={`prose ${styles.text}`}>
          <h2>{t('about.h1')}</h2>
          <p>{t('about.p1')}</p>
          <h2>{t('about.h2')}</h2>
          <p>{t('about.p2')}</p>
          <h2>{t('about.h3')}</h2>
          <p>{t('about.p3')}</p>
        </div>
        <Notice tone="demo" title={t('about.noticeTitle')}>{t('about.notice')}</Notice>
        <div className={styles.nfActions}>
          <Button to="/contact">{t('about.contact')}</Button>
          <Button to="/equipment" variant="secondary">{t('about.browse')}</Button>
        </div>
      </div>
    </>
  );
}
