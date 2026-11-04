import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/app/ThemeProvider';
import { useI18n } from '@/i18n/I18nProvider';
import { nextTheme, type ThemeChoice } from '@/lib/theme';
import styles from './ThemeToggle.module.css';

const ICONS = { light: Sun, dark: Moon, system: Monitor } as const;

/** Cycles light -> dark -> system. The icon shows the current choice. */
export function ThemeToggle() {
  const { choice, cycle } = useTheme();
  const { t } = useI18n();
  const Icon = ICONS[choice];
  const name = (c: ThemeChoice) => t(`theme.${c}`);
  return (
    <button type="button" className={styles.toggle} onClick={cycle} aria-label={t('theme.label', { current: name(choice), next: name(nextTheme(choice)) })} title={name(choice)}>
      <Icon aria-hidden="true" />
    </button>
  );
}
