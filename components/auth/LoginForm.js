'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import GoogleButton from './GoogleButton';
import { saveCredential } from '@/lib/credentials';
import styles from './Auth.module.css';

const OAUTH_ERRORS = {
  google: 'Google sign-in failed. Please try again.',
  google_not_configured: 'Google sign-in is not configured yet.',
  suspended: 'This account has been suspended. Contact support.',
};

// More specific hint based on which callback stage failed (?reason=...).
const OAUTH_REASONS = {
  state: 'Security check failed (cookie blocked or expired). Try again in the same browser tab.',
  token: 'Could not verify with Google — check GOOGLE_CLIENT_SECRET and the redirect URI.',
  db: 'Signed in with Google, but saving your account failed (database).',
};

function oauthMessage(params) {
  const err = params.get('error');
  if (!err) return '';
  const reason = params.get('reason');
  return (OAUTH_REASONS[reason] || OAUTH_ERRORS[err] || '');
}

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const next = params.get('next') || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState(oauthMessage(params));
  const [loading, setLoading] = useState(false);

  function update(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');
      // Prompt the browser's password manager to save these credentials.
      await saveCredential({ email: form.email, password: form.password, name: data.user?.name });
      await refresh();
      router.replace(next);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <div className={styles.field}>
        <label className="form-label">Email</label>
        <input
          className="form-input"
          type="email"
          name="email"
          id="login-email"
          placeholder="you@company.com"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          autoComplete="username"
          required
        />
      </div>
      <div className={styles.field}>
        <label className="form-label">Password</label>
        <div className={styles.passwordWrap}>
          <input
            className="form-input"
            type={show ? 'text' : 'password'}
            name="password"
            id="login-password"
            placeholder="Your password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            autoComplete="current-password"
            required
          />
          <button type="button" className={styles.eye} onClick={() => setShow((s) => !s)} aria-label="Toggle password">
            {show ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div className={styles.forgotRow}>
        <Link href="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.submit} disabled={loading}>
        {loading ? <span className={styles.spinner} /> : 'Log in'}
      </button>

      <GoogleButton next={next} />

      <p className={styles.alt}>
        New here? <Link href="/register">Create an account</Link>
      </p>
    </form>
  );
}
