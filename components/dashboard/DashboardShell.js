'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import styles from './Dashboard.module.css';

const ROLE_LABEL = { SUPER_ADMIN: 'Super Admin', ADMIN: 'Admin', USER: 'Member' };

export default function DashboardShell({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

  const links = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/billing', label: 'Billing & plans', icon: '💳' },
    { href: '/dashboard/account', label: 'Account', icon: '⚙️' },
  ];
  if (isAdmin) links.push({ href: '/dashboard/admin', label: 'User management', icon: '👥' });

  async function onLogout() {
    await logout();
    router.replace('/');
  }

  function isActive(link) {
    return pathname === link.href;
  }

  return (
    <div className={styles.wrap}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.brand}>
          <img src="/AutoFlow Brand/autoflow-mark.svg" alt="AutoFlow" width="28" height="28" />
          <span>Auto<span className={styles.brandAccent}>Flow</span></span>
        </Link>

        <nav className={styles.nav}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.navLink} ${isActive(l) ? styles.navActive : ''}`}
            >
              <span>{l.icon}</span> {l.label}
            </Link>
          ))}
        </nav>

        <div className={styles.userBox}>
          <div className={styles.avatar}>{(user.name || 'U').charAt(0).toUpperCase()}</div>
          <div className={styles.userMeta}>
            <div className={styles.userName}>{user.name}</div>
            <span className={`${styles.roleBadge} ${styles[`role_${user.role}`]}`}>
              {ROLE_LABEL[user.role]}
            </span>
          </div>
        </div>
        <button className={styles.logout} onClick={onLogout}>↩ Log out</button>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
