'use client';

import { useState } from 'react';
import styles from './Contact.module.css';

const services = [
  'Business process automation',
  'Email & outreach automation',
  'Web scraping & data pipelines',
  'API & webhook integration',
  'Social media automation',
  'Auto-generated dashboards',
  'Something else',
];

export default function Contact({ showToast }) {
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' });
  const [sending, setSending] = useState(false);

  function update(k, v) { setForm(p => ({ ...p, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('❌ Please fill in all required fields.');
      return;
    }
    setSending(true);
    // Demo mode: simulate sending
    await new Promise(r => setTimeout(r, 1800));
    setSending(false);
    setForm({ name: '', email: '', service: '', message: '' });
    showToast('✅ Message sent! Ezabul will reply within 4–8 hours.');
  }

  return (
    <section id="contact" style={{ background: 'var(--bg-white)' }}>
      <div className="section-inner">
        <span className="section-eyebrow reveal">Contact</span>
        <h2 className="section-title reveal">Let's talk automation</h2>
        <p className="section-sub reveal">Have a specific challenge? Book a free 30-minute discovery call or send a message.</p>

        <div className={styles.wrapper}>
          {/* Info card */}
          <div className={`${styles.infoCard} reveal reveal-left`}>
            <div className={styles.infoGlow} />
            <h3 className={styles.infoName}>Ezabul Bari</h3>
            <p className={styles.infoDesc}>
              Web developer & automation expert based in Bagerhat, Bangladesh. Serving clients globally with fast turnaround and clean, documented work.
            </p>
            <div className={styles.items}>
              <div className={styles.item}><span>📧</span> ezabul@autoflowsolutions.com</div>
              <div className={styles.item}><span>💬</span> WhatsApp: +880 XXX XXX XXXX</div>
              <div className={styles.item}><span>🕐</span> Response within 4–8 hours</div>
              <div className={styles.item}><span>🌍</span> Available worldwide — 30+ countries</div>
              <div className={styles.item}><span>📅</span> Free 30-min discovery call available</div>
            </div>
          </div>

          {/* Form */}
          <div className={`${styles.formCard} reveal reveal-right`}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.group}>
                  <label className="form-label">Your name *</label>
                  <input
                    className="form-input"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                  />
                </div>
                <div className={styles.group}>
                  <label className="form-label">Email address *</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.group}>
                <label className="form-label">What do you need automated?</label>
                <select
                  className="form-select"
                  value={form.service}
                  onChange={e => update('service', e.target.value)}
                >
                  <option value="">Select a service...</option>
                  {services.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className={styles.group}>
                <label className="form-label">Tell me about your project *</label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe your current process and what you'd like to automate. The more detail, the better!"
                  value={form.message}
                  onChange={e => update('message', e.target.value)}
                  rows={5}
                />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={sending}>
                {sending ? (
                  <span className={styles.spinner} />
                ) : (
                  'Send message →'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
