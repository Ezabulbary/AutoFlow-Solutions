'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { generateStrongPassword, scorePassword } from '@/lib/passwordClient';
import PasswordStrength from './PasswordStrength';
import styles from './Auth.module.css';

export default function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const token = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function suggest() {
    setPassword(generateStrongPassword(16));
    setShow(true);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!scorePassword(password).valid) {
      setError('Please choose a stronger password (use the Suggest button).');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not reset password.');
      await refresh();
      router.replace('/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className={styles.form}>
        <div className={styles.error}>This reset link is missing or invalid.</div>
        <p className={styles.alt}>
          <Link href="/forgot-password">Request a new reset link</Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className="form-label">New password</label>
          <button type="button" className={styles.suggestBtn} onClick={suggest}>
            ✨ Suggest strong
          </button>
        </div>
        <div className={styles.passwordWrap}>
          <input
            className="form-input"
            type={show ? 'text' : 'password'}
            name="password"
            id="reset-password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button type="button" className={styles.eye} onClick={() => setShow((s) => !s)} aria-label="Toggle password">
            {show ? '🙈' : '👁️'}
          </button>
        </div>
        <PasswordStrength password={password} />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.submit} disabled={loading}>
        {loading ? <span className={styles.spinner} /> : 'Reset password & log in'}
      </button>

      <p className={styles.alt}>
        <Link href="/login">← Back to login</Link>
      </p>
    </form>
  );
}
