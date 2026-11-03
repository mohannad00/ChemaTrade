import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { DemoTag } from './Badge';
import styles from './PageHeader.module.css';

interface Props {
  eyebrow: string;
  title: string;
  lede?: ReactNode;
  demoTag?: boolean;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, lede, demoTag, actions }: Props) {
  return (
    <header className={styles.header}>
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <div className={styles.row}>
          <h1>{title}</h1>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
        {lede && <p className="lede">{lede}</p>}
        {demoTag && <div className={styles.tag}><DemoTag>Sample content — demo</DemoTag></div>}
      </div>
    </header>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className={styles.crumbs}>
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

