import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Badge, DemoTag } from '@/components/ui/Badge';
import type { Equipment } from '../equipment.types';
import styles from './EquipmentCard.module.css';

export function EquipmentCard({ item, categoryName }: { item: Equipment; categoryName?: string }) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <span className="eyebrow">{categoryName ?? 'Equipment'}</span>
        <Badge>{item.status}</Badge>
      </div>
      <h3 className={styles.title}>
        <Link to={`/equipment/${item.slug}`} className={styles.link}>
          {item.name}
        </Link>
      </h3>
      <p className={styles.summary}>{item.summary}</p>
      <div className={styles.foot}>
        <DemoTag>Demo content</DemoTag>
        <ArrowUpRight aria-hidden="true" className={styles.arrow} />
      </div>
    </article>
  );
}
