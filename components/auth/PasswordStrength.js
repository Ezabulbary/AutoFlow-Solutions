'use client';

import { scorePassword } from '@/lib/passwordClient';
import styles from './Auth.module.css';

const BAR_COLORS = ['#FF4D6D', '#FF9900', '#FFC107', '#4D97E2', '#22C55E'];

export default function PasswordStrength({ password }) {
  if (!password) return null;
  const { score, label, checks } = scorePassword(password);
  const reqs = [
    ['length', '10+ characters'],
    ['upper', 'Uppercase'],
    ['lower', 'Lowercase'],
    ['number', 'Number'],
    ['symbol', 'Symbol'],
  ];

  return (
    <div className={styles.strength}>
      <div className={styles.strengthBars}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={styles.strengthBar}
            style={{ background: i <= score ? BAR_COLORS[score] : 'var(--border)' }}
          />
        ))}
      </div>
      <div className={styles.strengthLabel} style={{ color: BAR_COLORS[score] }}>
        {label}
      </div>
      <div className={styles.reqs}>
        {reqs.map(([key, text]) => (
          <span key={key} className={`${styles.req} ${checks[key] ? styles.reqMet : ''}`}>
            {checks[key] ? '✓' : '○'} {text}
          </span>
        ))}
      </div>
    </div>
  );
}
