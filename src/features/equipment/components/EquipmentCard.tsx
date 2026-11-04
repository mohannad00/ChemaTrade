import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Badge, DemoTag } from '@/components/ui/Badge';
import { EquipmentImage } from '@/components/ui/EquipmentImage';
import { useI18n } from '@/i18n/I18nProvider';
import type { Equipment } from '../equipment.types';
import styles from './EquipmentCard.module.css';

/** `item` must already be localized by the caller. */
export function EquipmentCard({ item, categoryName }: { item: Equipment; categoryName?: string }) {
  const { t } = useI18n();
  return (
    <article className={styles.card} data-glow>
      <EquipmentImage src={item.image} name={item.name} className={styles.media} />
      <div className={styles.top}>
        <span className="eyebrow">{categoryName ?? t('common.equipment')}</span>
        <Badge>{item.status}</Badge>
      </div>
      <h3 className={styles.title}>
        <Link to={`/equipment/${item.slug}`} className={styles.link}>
          {item.name}
        </Link>
      </h3>
      <p className={styles.summary}>{item.summary}</p>
      <div className={styles.foot}>
        <DemoTag>{t('common.demoContent')}</DemoTag>
        <ArrowUpRight aria-hidden="true" className={styles.arrow} />
      </div>
    </article>
  );
}
