'use client';

import styles from './Hero.module.css';

export default function Hero({ onCta }) {
  const stats = [
    { num: '150+', label: 'Workflows built' },
    { num: '40+', label: 'Happy clients' },
    { num: '30+', label: 'Countries served' },
    { num: '75%', label: 'Average time saved' },
  ];

  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroBg} />
      <div className={styles.heroOrbs}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
        <div className={`${styles.orb} ${styles.orb4}`} />
      </div>

      {/* Floating tech tags */}
      <div className={styles.floatTag} style={{ top: '18%', left: '6%', animationDelay: '0s' }}>⚡ Zapier</div>
      <div className={styles.floatTag} style={{ top: '35%', left: '3%', animationDelay: '1.5s' }}>🔗 Make.com</div>
      <div className={styles.floatTag} style={{ top: '60%', left: '7%', animationDelay: '3s' }}>🤖 n8n</div>
      <div className={styles.floatTag} style={{ top: '20%', right: '5%', animationDelay: '0.5s' }}>🧩 Airtable</div>
      <div className={styles.floatTag} style={{ top: '45%', right: '4%', animationDelay: '2s' }}>📊 Notion</div>
      <div className={styles.floatTag} style={{ top: '68%', right: '6%', animationDelay: '3.5s' }}>💳 Stripe API</div>

      <div className={styles.heroInner}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Available for new projects worldwide
        </div>

        <h1 className={styles.title}>
          Automate your business.<br />
          <span className={styles.hlViolet}>Save time.</span>{' '}
          <span className={styles.hlCyan}>Scale faster.</span>
        </h1>

        <p className={styles.sub}>
          Hi, I'm <strong>Ezabul Bari</strong> — web developer & automation expert. I build custom automation workflows that eliminate manual work and unlock growth for businesses worldwide.
        </p>

        <div className={styles.actions}>
          <button className="btn-primary" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            View plans & pricing
          </button>
          <button className="btn-secondary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            💬 Book a free call
          </button>
        </div>

        <div className={styles.stats}>
          {stats.map(s => (
            <div key={s.label} className={styles.stat}>
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
