'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { generateStrongPassword, scorePassword } from '@/lib/passwordClient';
import PasswordStrength from './PasswordStrength';
import GoogleButton from './GoogleButton';
import styles from './Auth.module.css';

export default function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const next = params.get('next') || '/dashboard';

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function suggest() {
    const pw = generateStrongPassword(16);
    update('password', pw);
    setShow(true);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!scorePassword(form.password).valid) {
      setError('Please choose a stronger password (use the Suggest button).');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');
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
        <label className="form-label">Full name</label>
        <input
          className="form-input"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          autoComplete="name"
          required
        />
      </div>
      <div className={styles.field}>
        <label className="form-label">Email</label>
        <input
          className="form-input"
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className="form-label">Password</label>
          <button type="button" className={styles.suggestBtn} onClick={suggest}>
            ✨ Suggest strong
          </button>
        </div>
        <div className={styles.passwordWrap}>
          <input
            className="form-input"
            type={show ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            autoComplete="new-password"
            required
          />
          <button type="button" className={styles.eye} onClick={() => setShow((s) => !s)} aria-label="Toggle password">
            {show ? '🙈' : '👁️'}
          </button>
        </div>
        <PasswordStrength password={form.password} />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.submit} disabled={loading}>
        {loading ? <span className={styles.spinner} /> : 'Create account'}
      </button>

      <GoogleButton next={next} label="Sign up with Google" />

      <p className={styles.alt}>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </form>
  );
}
