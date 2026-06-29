import { Suspense } from 'react';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import styles from '@/components/auth/Auth.module.css';

export const metadata = {
  title: 'Log in | AutoFlow Solutions',
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.backHome}>← Back to site</Link>
      <div className={styles.card}>
        <div className={styles.brand}>
          <img src="/AutoFlow Brand/autoflow-mark.svg" alt="AutoFlow" />
          <span className={styles.brandText}>Auto<span>Flow</span></span>
        </div>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Log in to your dashboard and billing history.</p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
