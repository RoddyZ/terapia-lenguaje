import type { ReactNode } from 'react';
import { Link } from 'react-router';
import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, backTo = '/', actions }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <Link to={backTo} className={styles.back} aria-label="Volver">
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
          <path
            d="M15 5l-7 7 7 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
      <div className={styles.titles}>
        <h1>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
