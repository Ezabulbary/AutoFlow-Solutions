import { Suspense } from 'react';
import Link from 'next/link';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import styles from '@/components/auth/Auth.module.css';

export const metadata = {
  title: 'Forgot password | AutoFlow Solutions',
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <main className={styles.page}>
      <Link href="/login" className={styles.backHome}>← Back to login</Link>
      <div className={styles.card}>
        <div className={styles.brand}>
          <img src="/AutoFlow Brand/autoflow-mark.svg" alt="AutoFlow" />
          <span className={styles.brandText}>Auto<span>Flow</span></span>
        </div>
        <h1 className={styles.title}>Forgot your password?</h1>
        <p className={styles.subtitle}>Enter your email and we&apos;ll send you a reset link.</p>
        <Suspense fallback={null}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
