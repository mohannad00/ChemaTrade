import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GlasswareFigure } from '@/components/ui/GlasswareFigure';
import { StageRings } from '@/components/ui/StageRings';
import { LoadingState, ErrorState, Notice } from '@/components/ui/States';
import { Reveal } from '@/components/ui/Reveal';
import { BackgroundWord } from '@/components/motion/BackgroundWord';
import { FloatItem } from '@/components/motion/FloatItem';
import { ScrollLayer } from '@/components/motion/ScrollLayer';
import { ScrollScale } from '@/components/motion/ScrollScale';
import { SectionHead } from '@/components/motion/SectionHead';
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
        <BackgroundWord text={t('home.bg.hero')} align="end" place="bottom" />
        <div className={`container ${styles.heroGrid}`}>
          <ScrollLayer className={styles.heroText} y={[0, -70]} opacity={[1, 0]}>
            <Reveal onMount delay={0.05}><p className="eyebrow bar">{t('home.heroEyebrow')}</p></Reveal>
            <Reveal onMount delay={0.15}><h1 id="hero-h">{t('home.heroPre')} <em>{t('home.heroEm')}</em> {t('home.heroPost')}</h1></Reveal>
            <Reveal onMount delay={0.3}><p className="lede">{t('home.heroLede')}</p></Reveal>
            <Reveal onMount delay={0.45}>
              <div className={styles.cta}>
                <Button to="/equipment" icon={<ArrowRight aria-hidden="true" />}>{t('home.browse')}</Button>
                <Button to="/request-quote" variant="secondary">{t('home.requestQuote')}</Button>
              </div>
            </Reveal>
            <div className={styles.plus} aria-hidden="true">{Array.from({ length: 28 }, (_, i) => <span key={i}>+</span>)}</div>
          </ScrollLayer>
          <ScrollLayer className={styles.stageWrap} y={[0, 110]} scale={[1, 0.88]} opacity={[1, 0.2]}>
            <Reveal onMount variant="scale" delay={0.2}>
              <div className={styles.stage}><StageRings /><GlasswareFigure /></div>
            </Reveal>
          </ScrollLayer>
        </div>
      </section>

      <section id="equipment" className={styles.section} aria-labelledby="eq-h">
        <BackgroundWord text={t('nav.equipment')} align="start" place="top" />
        <div className="container">
          <SectionHead titleId="eq-h" eyebrow={t('home.eq.eyebrow')} title={t('home.eq.title')} lede={t('home.eq.lede')} />
          {categories.status === 'loading' && <LoadingState />}
          {categories.status === 'error' && <ErrorState message={categories.error.message} onRetry={categories.retry} />}
          {cats && (
            <ul className={styles.tiles}>
              {cats.map((c, i) => (
                <li key={c.id}>
                  <FloatItem index={i}>
                    <Link to={`/equipment?category=${c.slug}`} className={styles.tile} data-glow>
                      <span className={`mono ${styles.tileNum}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={styles.tileName}>{c.name}</span>
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </FloatItem>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section id="maintenance" className={`${styles.section} ${styles.alt}`} aria-labelledby="mt-h">
        <BackgroundWord text={t('nav.maintenance')} align="end" place="top" />
        <div className="container">
          <SectionHead titleId="mt-h" eyebrow={t('home.mt.eyebrow')} title={t('home.mt.title')} lede={t('home.mt.lede')} />
          {maintenance.status === 'loading' && <LoadingState />}
          {maintenance.status === 'error' && <ErrorState message={maintenance.error.message} onRetry={maintenance.retry} />}
          {services_ && (
            <ul className={styles.cards}>
              {services_.map((m, i) => (
                <li key={m.id}>
                  <FloatItem index={i}><div className={styles.card} data-glow><h3>{m.title}</h3><p>{m.summary}</p></div></FloatItem>
                </li>
              ))}
            </ul>
          )}
          <Reveal>
            <div className={styles.cta}>
              <Button to="/maintenance" variant="secondary">{t('home.mt.services')}</Button>
              <Button to="/request-maintenance" variant="ghost" icon={<ArrowRight aria-hidden="true" />}>{t('home.mt.request')}</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="spare-parts" className={styles.section} aria-labelledby="sp-h">
        <BackgroundWord text={t('nav.spareParts')} align="start" place="top" />
        <div className="container">
          <SectionHead titleId="sp-h" eyebrow={t('home.sp.eyebrow')} title={t('home.sp.title')} lede={t('home.sp.lede')} />
          {parts.status === 'loading' && <LoadingState />}
          {parts.status === 'error' && <ErrorState message={parts.error.message} onRetry={parts.retry} />}
          {spare && (
            <ul className={styles.cards}>
              {spare.slice(0, 4).map((p, i) => (
                <li key={p.id}>
                  <FloatItem index={i}>
                    <div className={styles.card} data-glow><div className={styles.cardTop}><h3>{p.name}</h3><Badge>{p.status}</Badge></div><p>{p.description}</p></div>
                  </FloatItem>
                </li>
              ))}
            </ul>
          )}
          <Reveal><div className={styles.cta}><Button to="/spare-parts" variant="secondary">{t('home.sp.all')}</Button></div></Reveal>
        </div>
      </section>

      <section id="resources" className={`${styles.section} ${styles.alt}`} aria-labelledby="rs-h">
        <BackgroundWord text={t('nav.resources')} align="end" place="top" />
        <div className="container">
          <SectionHead titleId="rs-h" eyebrow={t('home.rs.eyebrow')} title={t('home.rs.title')} lede={t('home.rs.lede')} />
          {articles.status === 'loading' && <LoadingState />}
          {articles.status === 'error' && <ErrorState message={articles.error.message} onRetry={articles.retry} />}
          {arts && (
            <ul className={styles.cards}>
              {arts.slice(0, 3).map((a, i) => (
                <li key={a.id}>
                  <FloatItem index={i}>
                    <div className={styles.card} data-glow>
                      <p className={styles.meta}>{a.tag} · {formatDate(a.publishedAt)}</p>
                      <h3><Link to={`/resources/${a.slug}`}>{a.title}</Link></h3>
                    </div>
                  </FloatItem>
                </li>
              ))}
            </ul>
          )}
          <Reveal><div className={styles.cta}><Button to="/resources" variant="secondary">{t('home.rs.all')}</Button></div></Reveal>
        </div>
      </section>

      <section id="request" className={styles.section} aria-labelledby="rq-h">
        <ScrollScale className={`container ${styles.requestBand}`}>
          <SectionHead titleId="rq-h" eyebrow={t('home.rq.eyebrow')} title={t('home.rq.title')} lede={t('home.rq.lede')} eyebrowClassName={styles.onDark} ledeClassName={styles.onDarkText} />
          <Reveal delay={0.1}>
            <div className={styles.cta}>
              <Button to="/request-quote" variant="secondary" icon={<ArrowRight aria-hidden="true" />}>{t('footer.quotation')}</Button>
              <Button to="/request-maintenance" variant="ghost" className={styles.ghostOnDark}>{t('nav.requestMaintenance')}</Button>
              <Button to="/contact" variant="ghost" className={styles.ghostOnDark}>{t('nav.contact')}</Button>
            </div>
          </Reveal>
          <Reveal delay={0.2}><Notice tone="demo" title={t('common.demoContent')}>{t('demo.disclaimer')}</Notice></Reveal>
        </ScrollScale>
      </section>
    </div>
  );
}