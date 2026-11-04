import { PageHeader } from '@/components/ui/PageHeader';
import { Notice } from '@/components/ui/States';
import { useDocumentTitle } from '@/hooks/common';
import { useI18n } from '@/i18n/I18nProvider';
import styles from './CompanyPages.module.css';

export function PrivacyPage() {
  const { t } = useI18n();
  useDocumentTitle(t('privacy.title'));
  return (
    <>
      <PageHeader eyebrow={t('privacy.eyebrow')} title={t('privacy.title')} lede={t('privacy.lede')} />
      <div className={`container ${styles.wrap}`}>
        <Notice tone="demo" title={t('privacy.noticeTitle')}>{t('privacy.notice')}</Notice>
        <div className="prose">
          <h2>{t('privacy.h1')}</h2><p>{t('privacy.p1')}</p>
          <h2>{t('privacy.h2')}</h2><p>{t('privacy.p2')}</p>
          <h2>{t('privacy.h3')}</h2><p>{t('privacy.p3')}</p>
          <h2>{t('privacy.h4')}</h2><p>{t('privacy.p4')}</p>
        </div>
      </div>
    </>
  );
}

export function TermsPage() {
  const { t } = useI18n();
  useDocumentTitle(t('terms.title'));
  return (
    <>
      <PageHeader eyebrow={t('privacy.eyebrow')} title={t('terms.title')} lede={t('terms.lede')} />
      <div className={`container ${styles.wrap}`}>
        <Notice tone="demo" title={t('privacy.noticeTitle')}>{t('terms.notice')}</Notice>
        <div className="prose">
          <h2>{t('terms.h1')}</h2><p>{t('terms.p1')}</p>
          <h2>{t('terms.h2')}</h2><p>{t('terms.p2')}</p>
          <h2>{t('terms.h3')}</h2><p>{t('terms.p3')}</p>
          <h2>{t('terms.h4')}</h2><p>{t('terms.p4')}</p>
        </div>
      </div>
    </>
  );
}
