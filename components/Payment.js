import styles from './Payment.module.css';

const methods = [
  { icon: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex' },
  { icon: '🅿️', label: 'PayPal', sub: '200+ countries' },
  { icon: '₿', label: 'Crypto (USDT / BTC)', sub: 'TRC-20, ERC-20' },
  { icon: '🏦', label: 'Bank Transfer', sub: 'SWIFT, bKash, Nagad' },
];

const secBadges = [
  { icon: '🔒', label: 'SSL Secured' },
  { icon: '✅', label: 'Stripe Verified' },
  { icon: '🛡️', label: 'PCI-DSS Compliant' },
  { icon: '🔐', label: 'Fraud Protected' },
];

export default function Payment({ onSelectPlan }) {
  return (
    <section id="payment">
      <div className="section-inner">
        <span className="section-eyebrow reveal">Payment</span>
        <h2 className="section-title reveal">Secure, global payment, your way</h2>
        <p className="section-sub reveal">Pay securely from anywhere in the world using your preferred method.</p>

        <div className={styles.wrapper}>
          {/* Left: info */}
          <div className={`${styles.info} reveal reveal-left`}>
            <h3 className={styles.infoTitle}>Accepted payment methods</h3>
            <p className={styles.infoDesc}>
              All payments are processed securely through Stripe and PayPal. You'll receive an invoice and receipt instantly after payment. International cards, bank transfers, and crypto welcome.
            </p>
            <div className={styles.methods}>
              {methods.map(m => (
                <div key={m.label} className={styles.method}>
                  <span className={styles.methodIcon}>{m.icon}</span>
                  <div>
                    <div className={styles.methodLabel}>{m.label}</div>
                    <div className={styles.methodSub}>{m.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.secBadges}>
              {secBadges.map(b => (
                <div key={b.label} className={styles.secBadge}>
                  {b.icon} {b.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: CTA card */}
          <div className={`${styles.ctaCard} reveal reveal-right`}>
            <div className={styles.ctaGlow} />
            <div className={styles.ctaIcon}>🔒</div>
            <h3 className={styles.ctaTitle}>Ready to get started?</h3>
            <p className={styles.ctaDesc}>Choose a plan and pay securely in minutes. All methods available at checkout.</p>
            <button
              className={styles.ctaBtn}
              onClick={() => onSelectPlan('Growth Project', 500)}
            >
              🚀 Pay now: Choose your plan
            </button>
            <div className={styles.ctaPlanLinks}>
              <button className={styles.planLink} onClick={() => onSelectPlan('One-time Project', 200)}>Starter ($200+)</button>
              <span>·</span>
              <button className={styles.planLink} onClick={() => onSelectPlan('Growth Project', 500)}>Growth ($500+)</button>
              <span>·</span>
              <button className={styles.planLink} onClick={() => onSelectPlan('Monthly Partner', 300)}>Retainer ($300/mo)</button>
            </div>
            <div className={styles.ctaFooter}>
              Instant invoice & receipt · Cancel anytime (retainer)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
