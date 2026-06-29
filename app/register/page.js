import { Suspense } from 'react';
import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';
import styles from '@/components/auth/Auth.module.css';

export const metadata = {
  title: 'Create account | AutoFlow Solutions',
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.backHome}>← Back to site</Link>
      <div className={styles.card}>
        <div className={styles.brand}>
          <img src="/AutoFlow Brand/autoflow-mark.svg" alt="AutoFlow" />
          <span className={styles.brandText}>Auto<span>Flow</span></span>
        </div>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Register to purchase plans and track your projects.</p>
        <Suspense fallback={null}>
          <RegisterForm />
        </Suspense>
      </div>
    </main>
  );
}
