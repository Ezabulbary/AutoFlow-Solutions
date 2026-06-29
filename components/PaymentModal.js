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

// Demo mode is on unless the owner explicitly disables it after adding live keys.
const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

export default function PaymentModal({ plan, amount, tier = 'low', label, onClose, showToast, onPaid }) {
  const [tab, setTab] = useState('stripe');

  // Maps the tab's human label to the stored method code.
  const METHOD_CODE = { 'PayPal': 'paypal', 'Bank Transfer': 'bank' };

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

  // Card (Stripe) and Crypto (Coinbase) redirect via their API routes, which
  // record the payment server-side. PayPal and Bank Transfer settle in-modal,
  // so we persist them here before closing.
  async function handleSuccess(method) {
    const code = METHOD_CODE[method];
    if (code) {
      try {
        const res = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, method: code, tier, amount: plan === 'Custom' ? amount : undefined, label }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Could not record payment.');
        }
      } catch (err) {
        showToast(`❌ ${err.message}`);
        return;
      }
    }
    if (onPaid) {
      onPaid();
    } else {
      onClose();
      showToast(`✅ Payment via ${method} recorded!`);
    }
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

        {/* Demo mode banner — hidden automatically once NEXT_PUBLIC_DEMO_MODE=false */}
        {IS_DEMO && (
          <div className={styles.demoBanner}>
            🧪 <strong>Demo mode active</strong>. No real charges will be made. Add your API keys and set <code>NEXT_PUBLIC_DEMO_MODE=false</code> to go live.
          </div>
        )}

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
          {tab === 'stripe' && <StripeTab plan={plan} amount={amount} tier={tier} label={label} onSuccess={() => handleSuccess('Card')} />}
          {tab === 'paypal' && <PayPalTab plan={plan} amount={amount} onSuccess={() => handleSuccess('PayPal')} />}
          {tab === 'crypto' && <CryptoTab plan={plan} amount={amount} tier={tier} label={label} onSuccess={() => handleSuccess('Crypto')} />}
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
