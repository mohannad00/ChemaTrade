import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GlasswareFigure } from '@/components/ui/GlasswareFigure';
import { StageRings } from '@/components/ui/StageRings';
import { LoadingState, ErrorState, Notice } from '@/components/ui/States';
import { Reveal } from '@/components/ui/Reveal';
import { useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { useI18n } from '@/i18n/I18nProvider';
import { useLocalizedList } from '@/i18n/useLocalized';
import { services } from '@/services';
import styles from './HomePage.module.css';

export function HomePage() {
  const { t, formatDate } = useI18n();
  useDocumentTitle(t('home.heroPre') + ' ' + t('home.heroEm') + ' ' + t('home.heroPost'));
  const categories = useQuery(() => services.categories.list(), []);
  const maintenance = useQuery(() => services.maintenance.listServices(), []);
  const parts = useQuery(() => services.maintenance.listSparePartGroups(), []);
  const articles = useQuery(() => services.articles.list({ status: 'Published' }), []);
  const cats = useLocalizedList(categories.data);
  const services_ = useLocalizedList(maintenance.data);
  const spare = useLocalizedList(parts.data);
  const arts = useLocalizedList(articles.data);

  return (
    <div>
      <section id="hero" className={styles.hero} aria-labelledby="hero-h">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroText}>
            <p className="eyebrow bar">{t('home.heroEyebrow')}</p>
            <h1 id="hero-h">{t('home.heroPre')} <em>{t('home.heroEm')}</em> {t('home.heroPost')}</h1>
            <p className="lede">{t('home.heroLede')}</p>
            <div className={styles.cta}>
              <Button to="/equipment" icon={<ArrowRight aria-hidden="true" />}>{t('home.browse')}</Button>
              <Button to="/request-quote" variant="secondary">{t('home.requestQuote')}</Button>
            </div>
            <div className={styles.plus} aria-hidden="true">{Array.from({ length: 28 }, (_, i) => <span key={i}>+</span>)}</div>
          </div>
          <div className={styles.stage}><StageRings /><GlasswareFigure /></div>
        </div>
      </section>

      <section id="equipment" className={styles.section} aria-labelledby="eq-h">
        <div className="container">
          <Reveal>
            <p className="eyebrow bar">{t('home.eq.eyebrow')}</p>
            <h2 id="eq-h">{t('home.eq.title')}</h2>
            <p className="lede">{t('home.eq.lede')}</p>
          </Reveal>
          {categories.status === 'loading' && <LoadingState />}
          {categories.status === 'error' && <ErrorState message={categories.error.message} onRetry={categories.retry} />}
          {cats && (
            <ul className={`${styles.tiles} stagger`}>
              {cats.map((c, i) => (
                <li key={c.id}>
                  <Link to={`/equipment?category=${c.slug}`} className={styles.tile} data-glow>
                    <span className={`mono ${styles.tileNum}`}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.tileName}>{c.name}</span>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section id="maintenance" className={`${styles.section} ${styles.alt}`} aria-labelledby="mt-h">
        <div className="container">
          <Reveal>
            <p className="eyebrow bar">{t('home.mt.eyebrow')}</p>
            <h2 id="mt-h">{t('home.mt.title')}</h2>
            <p className="lede">{t('home.mt.lede')}</p>
          </Reveal>
          {maintenance.status === 'loading' && <LoadingState />}
          {maintenance.status === 'error' && <ErrorState message={maintenance.error.message} onRetry={maintenance.retry} />}
          {services_ && (
            <ul className={`${styles.cards} stagger`}>
              {services_.map((m) => (
                <li key={m.id} className={styles.card} data-glow><h3>{m.title}</h3><p>{m.summary}</p></li>
              ))}
            </ul>
          )}
          <div className={styles.cta}>
            <Button to="/maintenance" variant="secondary">{t('home.mt.services')}</Button>
            <Button to="/request-maintenance" variant="ghost" icon={<ArrowRight aria-hidden="true" />}>{t('home.mt.request')}</Button>
          </div>
        </div>
      </section>

      <section id="spare-parts" className={styles.section} aria-labelledby="sp-h">
        <div className="container">
          <Reveal>
            <p className="eyebrow bar">{t('home.sp.eyebrow')}</p>
            <h2 id="sp-h">{t('home.sp.title')}</h2>
            <p className="lede">{t('home.sp.lede')}</p>
          </Reveal>
          {parts.status === 'loading' && <LoadingState />}
          {parts.status === 'error' && <ErrorState message={parts.error.message} onRetry={parts.retry} />}
          {spare && (
            <ul className={`${styles.cards} stagger`}>
              {spare.slice(0, 4).map((p) => (
                <li key={p.id} className={styles.card} data-glow><div className={styles.cardTop}><h3>{p.name}</h3><Badge>{p.status}</Badge></div><p>{p.description}</p></li>
              ))}
            </ul>
          )}
          <div className={styles.cta}><Button to="/spare-parts" variant="secondary">{t('home.sp.all')}</Button></div>
        </div>
      </section>

      <section id="resources" className={`${styles.section} ${styles.alt}`} aria-labelledby="rs-h">
        <div className="container">
          <Reveal>
            <p className="eyebrow bar">{t('home.rs.eyebrow')}</p>
            <h2 id="rs-h">{t('home.rs.title')}</h2>
            <p className="lede">{t('home.rs.lede')}</p>
          </Reveal>
          {articles.status === 'loading' && <LoadingState />}
          {articles.status === 'error' && <ErrorState message={articles.error.message} onRetry={articles.retry} />}
          {arts && (
            <ul className={`${styles.cards} stagger`}>
              {arts.slice(0, 3).map((a) => (
                <li key={a.id} className={styles.card} data-glow>
                  <p className={styles.meta}>{a.tag} · {formatDate(a.publishedAt)}</p>
                  <h3><Link to={`/resources/${a.slug}`}>{a.title}</Link></h3>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.cta}><Button to="/resources" variant="secondary">{t('home.rs.all')}</Button></div>
        </div>
      </section>

      <section id="request" className={styles.section} aria-labelledby="rq-h">
        <div className={`container ${styles.requestBand}`}>
          <Reveal>
            <p className={`eyebrow bar ${styles.onDark}`}>{t('home.rq.eyebrow')}</p>
            <h2 id="rq-h">{t('home.rq.title')}</h2>
            <p className={`lede ${styles.onDarkText}`}>{t('home.rq.lede')}</p>
          </Reveal>
          <div className={styles.cta}>
            <Button to="/request-quote" variant="secondary" icon={<ArrowRight aria-hidden="true" />}>{t('footer.quotation')}</Button>
            <Button to="/request-maintenance" variant="ghost" className={styles.ghostOnDark}>{t('nav.requestMaintenance')}</Button>
            <Button to="/contact" variant="ghost" className={styles.ghostOnDark}>{t('nav.contact')}</Button>
          </div>
          <Notice tone="demo" title={t('common.demoContent')}>{t('demo.disclaimer')}</Notice>
        </div>
      </section>
    </div>
  );
}
