'use client';

import { useState } from 'react';
import { generateStrongPassword, scorePassword } from '@/lib/passwordClient';
import PasswordStrength from '@/components/auth/PasswordStrength';
import authStyles from '@/components/auth/Auth.module.css';
import styles from './Dashboard.module.css';

export default function ChangePasswordForm() {
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [show, setShow] = useState(false);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setNotice(null);
    if (!scorePassword(newPassword).valid) {
      setNotice({ type: 'err', msg: 'New password is too weak. Use the Suggest button.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not update password.');
      setNotice({ type: 'ok', msg: 'Password updated successfully.' });
      setCurrent('');
      setNew('');
    } catch (err) {
      setNotice({ type: 'err', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.formRow}>
      <div>
        <label className="form-label">Current password</label>
        <input
          className="form-input"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrent(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      <div>
        <div className={authStyles.labelRow}>
          <label className="form-label">New password</label>
          <button
            type="button"
            className={authStyles.suggestBtn}
            onClick={() => { setNew(generateStrongPassword(16)); setShow(true); }}
          >
            ✨ Suggest strong
          </button>
        </div>
        <div className={authStyles.passwordWrap}>
          <input
            className="form-input"
            type={show ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNew(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button type="button" className={authStyles.eye} onClick={() => setShow((s) => !s)} aria-label="Toggle">
            {show ? '🙈' : '👁️'}
          </button>
        </div>
        <PasswordStrength password={newPassword} />
      </div>

      {notice && (
        <div className={`${styles.notice} ${notice.type === 'ok' ? styles.noticeOk : styles.noticeErr}`}>
          {notice.msg}
        </div>
      )}

      <button type="submit" className={styles.saveBtn} disabled={loading}>
        {loading ? 'Saving…' : 'Update password'}
      </button>
    </form>
  );
}
