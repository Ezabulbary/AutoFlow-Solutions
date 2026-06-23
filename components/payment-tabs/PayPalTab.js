'use client';

import { useState } from 'react';
import styles from './PaymentTab.module.css';

export default function PayPalTab({ plan, amount, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  async function handlePayPal(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Demo mode: simulate PayPal redirect & approval
    await new Promise(r => setTimeout(r, 2500));
    setLoading(false);
    onSuccess();
  }

  return (
    <div className={styles.form}>
      <div className={styles.paypalLogo}>
        <span style={{ color: '#003087', fontWeight: 800, fontSize: 28 }}>Pay</span>
        <span style={{ color: '#009cde', fontWeight: 800, fontSize: 28 }}>Pal</span>
      </div>

      <p className={styles.paypalDesc}>
        You'll be redirected to PayPal to securely complete your payment. 200+ countries supported.
      </p>

      <form onSubmit={handlePayPal}>
        <div className={styles.group}>
          <label className="form-label">Your PayPal email</label>
          <input
            className="form-input"
            type="email"
            placeholder="your@paypal.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.orderSummary}>
          <div className={styles.orderRow}>
            <span>Service</span>
            <span>{plan}</span>
          </div>
          <div className={styles.orderRow}>
            <span>Amount</span>
            <strong>${amount} USD</strong>
          </div>
          <div className={styles.orderRow}>
            <span>Currency conversion</span>
            <span style={{ color: 'var(--green)' }}>✓ Auto</span>
          </div>
        </div>

        <button type="submit" className={`${styles.payBtn} ${styles.paypalBtn}`} disabled={loading}>
          {loading ? (
            <span className={styles.spinner} />
          ) : (
            <>🅿️ Pay ${amount} with PayPal</>
          )}
        </button>
      </form>

      <p className={styles.note}>PayPal buyer protection included. Cancel anytime for monthly plans.</p>
    </div>
  );
}
