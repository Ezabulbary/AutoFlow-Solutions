'use client';

import { useState } from 'react';
import styles from './PaymentTab.module.css';

const BANK_METHODS = [
  {
    id: 'wire',
    label: 'International Wire',
    icon: '🏦',
    details: [
      { label: 'Bank Name', value: 'Demo International Bank' },
      { label: 'Account Name', value: 'Md. Ezabul Bari' },
      { label: 'Account No.', value: 'DEMO-1234-5678-9012' },
      { label: 'SWIFT / BIC', value: 'DEMOXXXX' },
      { label: 'Currency', value: 'USD / EUR / GBP' },
    ],
  },
  {
    id: 'bkash',
    label: 'bKash (Bangladesh)',
    icon: '📱',
    details: [
      { label: 'bKash Number', value: '+880 1XXX-XXXXXX' },
      { label: 'Account Type', value: 'Personal' },
      { label: 'Reference', value: 'AutoFlow + your name' },
    ],
  },
  {
    id: 'nagad',
    label: 'Nagad (Bangladesh)',
    icon: '💸',
    details: [
      { label: 'Nagad Number', value: '+880 1XXX-XXXXXX' },
      { label: 'Account Type', value: 'Personal' },
      { label: 'Reference', value: 'AutoFlow + your name' },
    ],
  },
];

export default function BankTransferTab({ plan, amount, onSuccess, showToast }) {
  const [method, setMethod] = useState('wire');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [txRef, setTxRef] = useState('');
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(null);

  const bank = BANK_METHODS.find(b => b.id === method);

  function copyValue(val, key) {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleConfirm(e) {
    e.preventDefault();
    if (!name || !email) {
      showToast('❌ Please enter your name and email.');
      return;
    }
    setSending(true);
    // Demo mode: simulate email confirmation
    await new Promise(r => setTimeout(r, 2000));
    setSending(false);
    onSuccess();
  }

  return (
    <div className={styles.form}>
      {/* Method selector */}
      <div className={styles.bankMethodGrid}>
        {BANK_METHODS.map(b => (
          <button
            key={b.id}
            className={`${styles.bankMethodBtn} ${method === b.id ? styles.bankMethodActive : ''}`}
            onClick={() => setMethod(b.id)}
          >
            <span>{b.icon}</span>
            <span>{b.label}</span>
          </button>
        ))}
      </div>

      {/* Bank details */}
      <div className={styles.bankDetails}>
        <div className={styles.bankDetailsTitle}>📋 Payment Details — Copy & Transfer</div>
        {bank.details.map(d => (
          <div key={d.label} className={styles.bankDetailRow}>
            <span className={styles.bankDetailLabel}>{d.label}</span>
            <div className={styles.bankDetailRight}>
              <code className={styles.bankDetailValue}>{d.value}</code>
              <button
                className={styles.miniCopyBtn}
                onClick={() => copyValue(d.value, d.label)}
                type="button"
              >
                {copied === d.label ? '✅' : '📋'}
              </button>
            </div>
          </div>
        ))}
        <div className={styles.bankDetailRow} style={{ background: 'var(--amber-light)', borderRadius: 8, padding: '8px 12px' }}>
          <span className={styles.bankDetailLabel}>Amount</span>
          <strong>${amount} USD</strong>
        </div>
      </div>

      <form onSubmit={handleConfirm}>
        <div className={styles.group}>
          <label className="form-label">Your full name</label>
          <input className="form-input" placeholder="John Smith" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className={styles.group}>
          <label className="form-label">Email address (for confirmation)</label>
          <input className="form-input" type="email" placeholder="john@company.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className={styles.group}>
          <label className="form-label">Transaction reference (optional)</label>
          <input className="form-input" placeholder="Your bank ref / receipt number" value={txRef} onChange={e => setTxRef(e.target.value)} />
        </div>

        <button type="submit" className={styles.payBtn} disabled={sending}>
          {sending ? <span className={styles.spinner} /> : '📨 Confirm transfer & notify Ezabul'}
        </button>
      </form>

      <p className={styles.note}>
        After confirming, Ezabul will verify the transfer and start your project within 24 hours.
      </p>
    </div>
  );
}
