'use client';

import { useState, useEffect } from 'react';
import styles from './PaymentModal.module.css';
import StripeTab from './payment-tabs/StripeTab';
import PayPalTab from './payment-tabs/PayPalTab';
import CryptoTab from './payment-tabs/CryptoTab';
import BankTransferTab from './payment-tabs/BankTransferTab';

const TABS = [
  { id: 'stripe', icon: '💳', label: 'Card' },
  { id: 'paypal', icon: '🅿️', label: 'PayPal' },
  { id: 'crypto', icon: '₿', label: 'Crypto' },
  { id: 'bank', icon: '🏦', label: 'Bank Transfer' },
];

export default function PaymentModal({ plan, amount, onClose, showToast }) {
  const [tab, setTab] = useState('stripe');

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function handleSuccess(method) {
    onClose();
    showToast(`✅ Payment via ${method} initiated! Check your email for confirmation.`);
  }

  return (
    <div className={`${styles.overlay} ${styles.open}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.headerTitle}>Complete your order</div>
            <div className={styles.headerSub}>
              <span className={styles.planBadge}>{plan}</span>
              <span className={styles.amount}>Starting at ${amount}</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Demo mode banner */}
        <div className={styles.demoBanner}>
          🧪 <strong>Demo mode active</strong> — No real charges will be made. Add your API keys to `.env.local` to go live.
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`${styles.tab} ${tab === t.id ? styles.activeTab : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className={styles.tabIcon}>{t.icon}</span>
              <span className={styles.tabLabel}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className={styles.body}>
          {tab === 'stripe' && <StripeTab plan={plan} amount={amount} onSuccess={() => handleSuccess('Card')} />}
          {tab === 'paypal' && <PayPalTab plan={plan} amount={amount} onSuccess={() => handleSuccess('PayPal')} />}
          {tab === 'crypto' && <CryptoTab plan={plan} amount={amount} onSuccess={() => handleSuccess('Crypto')} />}
          {tab === 'bank' && <BankTransferTab plan={plan} amount={amount} onSuccess={() => handleSuccess('Bank Transfer')} showToast={showToast} />}
        </div>

        {/* Security footer */}
        <div className={styles.secFooter}>
          <span className={styles.secBadge}>🔒 SSL Encrypted</span>
          <span className={styles.secBadge}>✅ Stripe Verified</span>
          <span className={styles.secBadge}>🛡️ PCI-DSS Compliant</span>
        </div>
      </div>
    </div>
  );
}
