'use client';

import { useState } from 'react';
import styles from './PaymentTab.module.css';

function formatCard(val) {
  return val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
}

function formatExpiry(val) {
  const v = val.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) return v.slice(0, 2) + ' / ' + v.slice(2);
  return v;
}

export default function StripeTab({ plan, amount, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', cardNum: '', expiry: '', cvv: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(field, val) {
    setForm(prev => ({ ...prev, [field]: val }));
  }

  async function handlePay(e) {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.cardNum || !form.expiry || !form.cvv) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          amount,
          email: form.email,
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Payment initialization failed.');
      }

      // Redirect to Stripe Checkout or local success page
      window.location.href = data.url;
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handlePay} className={styles.form}>
      <div className={styles.group}>
        <label className="form-label">Full name</label>
        <input
          className="form-input"
          placeholder="John Smith"
          value={form.name}
          onChange={e => update('name', e.target.value)}
        />
      </div>
      <div className={styles.group}>
        <label className="form-label">Email address</label>
        <input
          className="form-input"
          type="email"
          placeholder="john@company.com"
          value={form.email}
          onChange={e => update('email', e.target.value)}
        />
      </div>
      <div className={styles.group}>
        <label className="form-label">Card number</label>
        <div className={styles.cardField}>
          <input
            placeholder="4242 4242 4242 4242"
            value={form.cardNum}
            onChange={e => update('cardNum', formatCard(e.target.value))}
            maxLength={19}
          />
          <div className={styles.brands}>
            <span className={styles.visa}>VISA</span>
            <span className={styles.mc}>MC</span>
            <span className={styles.amex}>AMEX</span>
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.group}>
          <label className="form-label">Expiry</label>
          <input
            className="form-input"
            placeholder="MM / YY"
            value={form.expiry}
            onChange={e => update('expiry', formatExpiry(e.target.value))}
            maxLength={7}
          />
        </div>
        <div className={styles.group}>
          <label className="form-label">CVV</label>
          <input
            className="form-input"
            placeholder="•••"
            value={form.cvv}
            onChange={e => update('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            type="password"
          />
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.payBtn} disabled={loading}>
        {loading ? (
          <span className={styles.spinner} />
        ) : (
          <>🔒 Pay ${amount} securely</>
        )}
      </button>

      <p className={styles.note}>
        Powered by <strong>Stripe</strong>. Your card details are encrypted and never stored.
      </p>

      <div className={styles.testHint}>
        🧪 Test card: <code>4242 4242 4242 4242</code> | Expiry: any future date | CVV: any 3 digits
      </div>
    </form>
  );
}
