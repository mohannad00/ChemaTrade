import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

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

export function SiteLayout() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollManager />
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
