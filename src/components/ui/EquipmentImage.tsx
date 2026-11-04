import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';
import styles from './EquipmentImage.module.css';

interface Props {
  src?: string;
  name: string;
  className?: string;
  eager?: boolean;
}

/** Product image with a graceful fallback when the image is missing or fails to load. */
export function EquipmentImage({ src, name, className, eager }: Props) {
  const { t } = useI18n();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = !!src && failedSrc !== src;
  return (
    <div className={`${styles.frame} ${className ?? ''}`}>
      {showImage ? (
        <img
          className={styles.img}
          src={src}
          alt={t('image.alt', { name })}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <div className={styles.fallback} role="img" aria-label={t('image.none', { name })}>
          <ImageOff aria-hidden="true" />
        </div>
      )}
      <span className={styles.tag}>{t('image.sample')}</span>
    </div>
  );
}
