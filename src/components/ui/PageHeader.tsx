import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { DemoTag } from './Badge';
import { Reveal } from './Reveal';
import styles from './PageHeader.module.css';

interface Props {
  eyebrow: string;
  title: string;
  lede?: ReactNode;
  demoTag?: boolean;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, lede, demoTag, actions }: Props) {
  const { t } = useI18n();
  return (
    <header className={styles.header}>
      <div className="container">
        <Reveal onMount><p className="eyebrow">{eyebrow}</p></Reveal>
        <Reveal onMount delay={0.08}>
          <div className={styles.row}>
            <h1>{title}</h1>
            {actions && <div className={styles.actions}>{actions}</div>}
          </div>
        </Reveal>
        {lede && <Reveal onMount delay={0.18}><p className="lede">{lede}</p></Reveal>}
        {demoTag && <Reveal onMount delay={0.26}><div className={styles.tag}><DemoTag>{t('common.sampleDemo')}</DemoTag></div></Reveal>}
      </div>
    </header>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  const { t } = useI18n();
  return (
    <nav aria-label={t('common.breadcrumb')} className={styles.crumbs}>
      <ol>
        {items.map((it, i) => (
          <li key={it.label}>
            {it.to ? <Link to={it.to}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
            {i < items.length - 1 && <span aria-hidden="true"> / </span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

