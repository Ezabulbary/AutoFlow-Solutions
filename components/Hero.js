'use client';

import styles from './Hero.module.css';
import CountUp from './CountUp';

export default function Hero() {
  const stats = [
    { end: 150, suffix: '+', label: 'Workflows built' },
    { end: 40, suffix: '+', label: 'Happy clients' },
    { end: 30, suffix: '+', label: 'Countries served' },
    { end: 75, suffix: '%', label: 'Average time saved' },
  ];

  // The animated automation pipeline shown on the right.
  const pipeline = [
    { icon: '📥', title: 'Trigger', sub: 'New lead, order or email', color: 'var(--violet)' },
    { icon: '⚙️', title: 'Automate', sub: 'Enrich · route · sync · notify', color: 'var(--cyan)' },
    { icon: '🚀', title: 'Result', sub: 'Hours saved, every day', color: 'var(--amber)' },
  ];

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroBg} />
      <div className={styles.grid} />
      <div className={styles.heroOrbs}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
      </div>

      <div className={styles.heroInner}>
        {/* Left: copy */}
        <div className={styles.copy}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Available for new projects worldwide
          </div>

          <h1 className={styles.title}>
            Automate your business.<br />
            <span className="gradient-text">Save time. Scale faster.</span>
          </h1>

          <p className={styles.sub}>
            Hi, I'm <strong>Ezabul Bari</strong> — web developer & automation expert. I build custom
            workflows that eliminate manual work and unlock growth for businesses worldwide.
          </p>

          <div className={styles.actions}>
            <button className="btn-primary" onClick={() => scrollTo('pricing')}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              View plans &amp; pricing
            </button>
            <button className="btn-secondary" onClick={() => scrollTo('contact')}>
              💬 Book a free call
            </button>
          </div>

          <div className={styles.stats}>
            {stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <div className={styles.statNum}>
                  <CountUp end={s.end} suffix={s.suffix} />
                </div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: animated automation pipeline */}
        <div className={styles.visual}>
          <div className={styles.pipeCard}>
            <div className={styles.pipeHead}>
              <span className={styles.pipeDots}>
                <i /><i /><i />
              </span>
              <span className={styles.pipeName}>autoflow · live workflow</span>
              <span className={styles.pipeLive}>● running</span>
            </div>

            <div className={styles.pipeBody}>
              {pipeline.map((node, i) => (
                <div className={styles.node} key={node.title} style={{ animationDelay: `${i * 0.18}s` }}>
                  <div className={styles.nodeIcon} style={{ '--node': node.color }}>
                    {node.icon}
                  </div>
                  <div className={styles.nodeText}>
                    <div className={styles.nodeTitle}>{node.title}</div>
                    <div className={styles.nodeSub}>{node.sub}</div>
                  </div>
                  {i < pipeline.length - 1 && (
                    <div className={styles.connector}>
                      <span className={styles.packet} style={{ animationDelay: `${i * 0.9}s` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.pipeFoot}>
              <span className={styles.pipeStat}>⚡ 0 manual steps</span>
              <span className={styles.pipeStat}>✓ runs 24/7</span>
            </div>
          </div>

          {/* Floating tech tags around the card */}
          <div className={`${styles.floatTag} ${styles.tagA}`}>⚡ Zapier</div>
          <div className={`${styles.floatTag} ${styles.tagB}`}>🔗 Make.com</div>
          <div className={`${styles.floatTag} ${styles.tagC}`}>🤖 n8n</div>
          <div className={`${styles.floatTag} ${styles.tagD}`}>💳 Stripe API</div>
        </div>
      </div>
    </section>
  );
}
