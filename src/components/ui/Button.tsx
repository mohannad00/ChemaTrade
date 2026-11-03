import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface CommonProps {
  variant?: Variant;
  size?: 'md' | 'sm';
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

type ButtonProps = CommonProps & { to?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkProps = CommonProps & { to: string; onClick?: () => void; 'aria-label'?: string };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', size = 'md', children, icon, className } = props;
  const cls = cx(styles.button, styles[variant], size === 'sm' && styles.sm, className);
  if (props.to !== undefined) {
    return (
      <Link to={props.to} className={cls} onClick={props.onClick} aria-label={props['aria-label']}>
        <span>{children}</span>
        {icon}
      </Link>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, children: _c, icon: _i, className: _cn, to: _t, type = 'button', ...rest } = props;
  return (
    <button type={type} className={cls} {...rest}>
      <span>{children}</span>
      {icon}
    </button>
  );
}
