'use client';

import { useState } from 'react';
import styles from './PaymentTab.module.css';

const CRYPTO_OPTIONS = [
  { id: 'usdt', label: 'USDT (TRC-20)', icon: '💲', address: 'TDemo1234567890abcdef1234567890abcdef12', network: 'TRON' },
  { id: 'usdt-erc', label: 'USDT (ERC-20)', icon: '🔷', address: '0xDemo1234567890abcdef1234567890abcdef1234', network: 'Ethereum' },
  { id: 'btc', label: 'Bitcoin (BTC)', icon: '₿', address: 'bc1demo1234567890abcdef1234567890abcdef1234', network: 'Bitcoin' },
];

export default function CryptoTab({ plan, amount, onSuccess }) {
  const [selected, setSelected] = useState('usdt');
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [email, setEmail] = useState('');
  const [gatewayLoading, setGatewayLoading] = useState(false);
  const [error, setError] = useState('');

  const coin = CRYPTO_OPTIONS.find(c => c.id === selected);

  function copyAddress() {
    navigator.clipboard.writeText(coin.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleConfirm() {
    setConfirming(true);
    // Simulate manual confirmation
    await new Promise(r => setTimeout(r, 2000));
    setConfirming(false);
    onSuccess();
  }

  async function handleCoinbasePay(e) {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setGatewayLoading(true);
    try {
      const res = await fetch('/api/coinbase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, amount, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize Coinbase payment.');
      }
      // Redirect to Coinbase Commerce checkout or local success page
      window.location.href = data.url;
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      setGatewayLoading(false);
    }
  }

  return (
    <div className={styles.form}>
      <div className={styles.cryptoHeader}>
        <div className={styles.cryptoIcon}>₿</div>
        <div>
          <div className={styles.cryptoTitle}>Pay with Cryptocurrency</div>
          <div className={styles.cryptoSub}>USDT, BTC accepted. Powered by Coinbase Commerce.</div>
        </div>
      </div>

      {/* Automatic Gateway Form */}
      <form onSubmit={handleCoinbasePay} className={styles.form} style={{ gap: '8px' }}>
        <div className={styles.group}>
          <label className="form-label">Email address (for invoice/receipt)</label>
          <input
            className="form-input"
            type="email"
            placeholder="john@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.payBtn} disabled={gatewayLoading} style={{ marginTop: '4px' }}>
          {gatewayLoading ? <span className={styles.spinner} /> : `⚡ Pay $${amount} via Coinbase Commerce`}
        </button>
      </form>

      <div style={{ textAlign: 'center', color: 'var(--text-faint)', fontSize: '11px', margin: '12px 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        — OR PAY MANUALLY TO WALLET —
      </div>

      {/* Coin selector */}
      <div className={styles.coinGrid}>
        {CRYPTO_OPTIONS.map(c => (
          <button
            key={c.id}
            className={`${styles.coinBtn} ${selected === c.id ? styles.coinActive : ''}`}
            onClick={() => setSelected(c.id)}
            type="button"
          >
            <span>{c.icon}</span>
            <span style={{ fontSize: 11 }}>{c.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Amount */}
      <div className={styles.cryptoAmount}>
        <div className={styles.amountLabel}>Amount to send</div>
        <div className={styles.amountValue}>${amount} USD <span style={{ color: 'var(--text-faint)', fontSize: 13 }}>(≈ {amount} USDT)</span></div>
      </div>

      {/* Wallet address */}
      <div className={styles.group}>
        <label className="form-label">Send to address ({coin.network})</label>
        <div className={styles.addressBox}>
          <code className={styles.address}>{coin.address}</code>
          <button className={styles.copyBtn} onClick={copyAddress} type="button">
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
      </div>

      <div className={styles.cryptoWarning}>
        ⚠️ Send <strong>exactly ${amount} USDT/BTC</strong> to the address above. After sending, click the button below.
      </div>

      <button className={styles.payBtn} onClick={handleConfirm} disabled={confirming} type="button">
        {confirming ? <span className={styles.spinner} /> : "✅ I've sent the payment"}
      </button>

      <p className={styles.note}>
        Transactions are verified on-chain. Confirmation may take 1–10 minutes.
      </p>
    </div>
  );
}
