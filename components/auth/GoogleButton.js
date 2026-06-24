'use client';

import styles from './Auth.module.css';

export default function GoogleButton({ next = '/dashboard', label = 'Continue with Google' }) {
  const href = `/api/auth/google?next=${encodeURIComponent(next)}`;
  return (
    <>
      <div className={styles.divider}><span>or</span></div>
      <a className={styles.googleBtn} href={href}>
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 4.1 29.6 2 24 2 12 2 2 12 2 24s10 22 22 22 22-10 22-22c0-1.3-.1-2.5-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 4.1 29.6 2 24 2 16 2 9.1 6.5 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 46c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 36.3 26.9 37 24 37c-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.1 41.4 16 46 24 46z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.6 5.6C41.5 36.5 46 31 46 24c0-1.3-.1-2.5-.4-3.5z" />
        </svg>
        {label}
      </a>
    </>
  );
}
