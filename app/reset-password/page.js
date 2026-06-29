import { Suspense } from 'react';
import Link from 'next/link';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import styles from '@/components/auth/Auth.module.css';

export const metadata = {
  title: 'Reset password | AutoFlow Solutions',
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <main className={styles.page}>
      <Link href="/login" className={styles.backHome}>← Back to login</Link>
      <div className={styles.card}>
        <div className={styles.brand}>
          <img src="/AutoFlow Brand/autoflow-mark.svg" alt="AutoFlow" />
          <span className={styles.brandText}>Auto<span>Flow</span></span>
        </div>
        <h1 className={styles.title}>Set a new password</h1>
        <p className={styles.subtitle}>Choose a strong password for your account.</p>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
