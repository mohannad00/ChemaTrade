import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import styles from './Footer.module.css';

export function Footer() {
  const { t, lang } = useI18n();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className={styles.brand}>{lang === 'ar' ? <>كيما <em>ترايد</em></> : <>Chema <em>Trade</em></>}</p>
          <p className={styles.note}>{t('demo.disclaimer')}</p>
        </div>
        <nav aria-label={t('footer.exploreNav')}>
          <h2>{t('footer.explore')}</h2>
          <ul>
            <li><Link to="/equipment">{t('footer.catalog')}</Link></li>
            <li><Link to="/maintenance">{t('footer.maintenance')}</Link></li>
            <li><Link to="/spare-parts">{t('footer.spareParts')}</Link></li>
            <li><Link to="/resources">{t('footer.resources')}</Link></li>
          </ul>
        </nav>
        <nav aria-label={t('footer.companyNav')}>
          <h2>{t('footer.company')}</h2>
          <ul>
            <li><Link to="/request-quote">{t('footer.quotation')}</Link></li>
            <li><Link to="/request-maintenance">{t('footer.requestMaintenance')}</Link></li>
            <li><Link to="/about">{t('footer.about')}</Link></li>
            <li><Link to="/contact">{t('footer.contact')}</Link></li>
          </ul>
        </nav>
        <nav aria-label={t('footer.legalNav')}>
          <h2>{t('footer.legal')}</h2>
          <ul>
            <li><Link to="/privacy">{t('footer.privacy')}</Link></li>
            <li><Link to="/terms">{t('footer.terms')}</Link></li>
            <li><Link to="/admin">{t('footer.admin')}</Link></li>
          </ul>
        </nav>
      </div>
      <div className={`container ${styles.base}`}>
        <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
        <span>{t('footer.build')}</span>
      </div>
    </footer>
  );
}
