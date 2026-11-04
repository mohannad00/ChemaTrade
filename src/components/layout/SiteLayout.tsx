import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { Footer } from './Footer';
import { Header } from './Header';
import { PointerEffects } from './PointerEffects';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

/** Re-runs the entrance animation whenever the route changes (the key remounts the wrapper). */
function PageTransition() {
  const { pathname } = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} key={pathname} className="page-enter">
      <Outlet />
    </div>
  );
}

export function SiteLayout() {
  const { t } = useI18n();
  return (
    <>
      <a href="#main" className="skip-link">{t('a11y.skip')}</a>
      <ScrollManager />
      <PointerEffects />
      <Header />
      <main id="main" tabIndex={-1}>
        <PageTransition />
      </main>
      <Footer />
    </>
  );
}
