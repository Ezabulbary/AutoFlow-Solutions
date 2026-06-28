'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Auth.module.css';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className={styles.form}>
        <div className={styles.success}>
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link.
          Check your inbox (and spam folder).
        </div>
        <p className={styles.alt}>
          <Link href="/login">← Back to login</Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <div className={styles.field}>
        <label className="form-label">Email</label>
        <input
          className="form-input"
          type="email"
          name="email"
          id="forgot-email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.submit} disabled={loading}>
        {loading ? <span className={styles.spinner} /> : 'Send reset link'}
      </button>

      <p className={styles.alt}>
        Remembered it? <Link href="/login">Log in</Link>
      </p>
    </form>
  );
}
