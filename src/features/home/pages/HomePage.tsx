import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GlasswareFigure } from '@/components/ui/GlasswareFigure';
import { LoadingState, ErrorState, Notice } from '@/components/ui/States';
import { PRODUCT_CUTOUT_ALT, PRODUCT_CUTOUT_SRC, TravelingProduct, useProductMode } from '@/components/layout/TravelingProduct';
import { Reveal } from '@/components/ui/Reveal';
import { DEMO_DISCLAIMER } from '@/config/app.config';
import { useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { formatDate } from '@/lib/format';
import { services } from '@/services';
import styles from './HomePage.module.css';

export const HOME_SECTIONS = ['hero', 'equipment', 'maintenance', 'spare-parts', 'resources', 'request'] as const;
const SIDES = ['right', 'left', 'right', 'left', 'right', 'left'] as const;

export function HomePage() {
  useDocumentTitle('Scientific equipment, maintenance & spare parts');
  const mode = useProductMode();
  const travel = mode === 'travel';
  const categories = useQuery(() => services.categories.list(), []);
  const maintenance = useQuery(() => services.maintenance.listServices(), []);
  const parts = useQuery(() => services.maintenance.listSparePartGroups(), []);
  const articles = useQuery(() => services.articles.list({ status: 'Published' }), []);

  const sectionClass = (i: number) => `${styles.section} ${travel ? (SIDES[i] === 'left' ? styles.padLeft : styles.padRight) : ''}`;

  return (
    <div className={styles.home}>
      {travel && <TravelingProduct sectionIds={HOME_SECTIONS} sides={SIDES} />}

      <section id="hero" className={`${styles.hero} ${sectionClass(0)}`} aria-labelledby="hero-h">
        <div className="container">
          <p className="eyebrow">Laboratory equipment · maintenance · spare parts</p>
          <h1 id="hero-h">Scientific equipment, <em>sourced</em> and supported.</h1>
          <p className="lede">Browse a sample catalog, request a quotation, or ask for maintenance. Chema Trade confirms availability and specifications directly with you.</p>
          <div className={styles.cta}>
            <Button to="/equipment" icon={<ArrowRight aria-hidden="true" />}>Browse equipment</Button>
            <Button to="/request-quote" variant="secondary">Request a quotation</Button>
          </div>
          <div className={styles.figure}><GlasswareFigure /></div>
          {!travel && <img className={styles.staticProduct} src={PRODUCT_CUTOUT_SRC} alt={PRODUCT_CUTOUT_ALT} width={300} height={435} />}
        </div>
      </section>

      <section id="equipment" className={sectionClass(1)} aria-labelledby="eq-h">
        <div className="container">
          <Reveal>
            <p className="eyebrow">01 — Equipment</p>
            <h2 id="eq-h">Families of laboratory equipment</h2>
            <p className="lede">Sample categories that show how the catalog is organised. Each links to filtered, demonstration listings.</p>
          </Reveal>
          {categories.status === 'loading' && <LoadingState />}
          {categories.status === 'error' && <ErrorState message={categories.error.message} onRetry={categories.retry} />}
          {categories.status === 'success' && (
            <ul className={styles.index}>
              {categories.data.map((c, i) => (
                <li key={c.id}>
                  <Link to={`/equipment?category=${c.slug}`} className={styles.indexLink}>
                    <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.indexName}>{c.name}</span>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section id="maintenance" className={sectionClass(2)} aria-labelledby="mt-h">
        <div className="container">
          <Reveal>
            <p className="eyebrow">02 — Maintenance</p>
            <h2 id="mt-h">Service that keeps instruments working</h2>
            <p className="lede">Preventive maintenance, repair, calibration support and installation. Scope and timing are agreed with Chema Trade.</p>
          </Reveal>
          {maintenance.status === 'loading' && <LoadingState />}
          {maintenance.status === 'error' && <ErrorState message={maintenance.error.message} onRetry={maintenance.retry} />}
          {maintenance.status === 'success' && (
            <ul className={styles.rules}>
              {maintenance.data.map((m) => (
                <li key={m.id}><h3>{m.title}</h3><p>{m.summary}</p></li>
              ))}
            </ul>
          )}
          <div className={styles.cta}>
            <Button to="/maintenance" variant="secondary">Maintenance services</Button>
            <Button to="/request-maintenance" variant="ghost" icon={<ArrowRight aria-hidden="true" />}>Request maintenance</Button>
          </div>
        </div>
      </section>

      <section id="spare-parts" className={sectionClass(3)} aria-labelledby="sp-h">
        <div className="container">
          <Reveal>
            <p className="eyebrow">03 — Spare parts</p>
            <h2 id="sp-h">Parts, handled by request</h2>
            <p className="lede">Tell us the instrument and the part. We confirm whether and how it can be sourced; no stock is implied.</p>
          </Reveal>
          {parts.status === 'loading' && <LoadingState />}
          {parts.status === 'error' && <ErrorState message={parts.error.message} onRetry={parts.retry} />}
          {parts.status === 'success' && (
            <ul className={styles.rules}>
              {parts.data.slice(0, 4).map((p) => (
                <li key={p.id}><div className={styles.ruleTop}><h3>{p.name}</h3><Badge>{p.status}</Badge></div><p>{p.description}</p></li>
              ))}
            </ul>
          )}
          <div className={styles.cta}><Button to="/spare-parts" variant="secondary">All spare-part groups</Button></div>
        </div>
      </section>

      <section id="resources" className={sectionClass(4)} aria-labelledby="rs-h">
        <div className="container">
          <Reveal>
            <p className="eyebrow">04 — Technical resources</p>
            <h2 id="rs-h">Notes from the bench</h2>
            <p className="lede">Sample articles on weighing, microscopy, safety and maintenance planning.</p>
          </Reveal>
          {articles.status === 'loading' && <LoadingState />}
          {articles.status === 'error' && <ErrorState message={articles.error.message} onRetry={articles.retry} />}
          {articles.status === 'success' && (
            <ul className={styles.rules}>
              {articles.data.slice(0, 3).map((a) => (
                <li key={a.id}>
                  <p className="mono">{a.tag} · {formatDate(a.publishedAt)}</p>
                  <h3><Link to={`/resources/${a.slug}`}>{a.title}</Link></h3>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.cta}><Button to="/resources" variant="secondary">All resources</Button></div>
        </div>
      </section>

      <section id="request" className={sectionClass(5)} aria-labelledby="rq-h">
        <div className="container">
          <Reveal>
            <p className="eyebrow">05 — Request</p>
            <h2 id="rq-h">Ask Chema Trade</h2>
            <p className="lede">Request a quotation or maintenance. In this demo, forms are simulated and appear in the demo dashboard only.</p>
          </Reveal>
          <div className={styles.cta}>
            <Button to="/request-quote" icon={<ArrowRight aria-hidden="true" />}>Request a quotation</Button>
            <Button to="/request-maintenance" variant="secondary">Request maintenance</Button>
            <Button to="/contact" variant="ghost">Contact</Button>
          </div>
          <Notice tone="demo" title="Demo content">{DEMO_DISCLAIMER}</Notice>
        </div>
      </section>
    </div>
  );
}
