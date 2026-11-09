import { Link, Outlet, useNavigation } from 'react-router';
import { env } from '@/config/env';
import styles from './AppShell.module.css';

export function AppShell() {
  const navigation = useNavigation();

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link to="/" className={styles.brand} aria-label={`${env.appName}, inicio`}>
          <span className={styles.logo} aria-hidden="true">
            👄
          </span>
          {env.appName}
        </Link>
        {env.appEnv !== 'production' && (
          <span className={styles.envBadge} data-env={env.appEnv}>
            {env.appEnv} · v{env.version}
          </span>
        )}
        <Link to="/ajustes" className={styles.settings} aria-label="Ajustes para la terapeuta">
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Zm7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.3 7.3 0 0 0-1.69-.98l-.38-2.65A.49.49 0 0 0 14 2h-4a.49.49 0 0 0-.49.42l-.38 2.65c-.61.25-1.17.58-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.43.49.43h4c.25 0 .46-.19.49-.43l.38-2.65a7.3 7.3 0 0 0 1.69-.98l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"
            />
          </svg>
        </Link>
      </header>
      <main className={styles.main} aria-busy={navigation.state === 'loading'}>
        <Outlet />
      </main>
    </div>
  );
}
