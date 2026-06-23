'use client';

import { useState } from 'react';
import styles from './Faq.module.css';

const faqs = [
  {
    q: 'How long does a typical automation project take?',
    a: 'Most Starter projects are completed in 3–5 business days. Growth projects typically take 7–14 days depending on complexity. Retainer clients get ongoing weekly deliveries with priority turnaround.',
  },
  {
    q: 'Do I need any technical knowledge to use the automations?',
    a: 'Not at all. Every automation comes with a recorded video walkthrough and written documentation. I design everything to be manageable by non-technical users. I\'m also available for questions anytime during your support period.',
  },
  {
    q: 'What if the automation breaks or needs changes?',
    a: 'All projects include a support period (7 or 30 days depending on plan) where I fix any bugs at no extra cost. Retainer clients get ongoing maintenance included. Beyond the support period, fixes are billed at a simple hourly rate.',
  },
  {
    q: 'Can you work with the tools my business already uses?',
    a: 'Almost certainly yes. I work with 100+ platforms including Zapier, Make, n8n, Airtable, Notion, Shopify, HubSpot, Salesforce, Google Workspace, Slack, and many more. If you\'re not sure, just ask — I\'ll confirm before we start.',
  },
  {
    q: 'Is payment secure? Can I pay in my local currency?',
    a: 'Yes. Payments are processed via Stripe and PayPal — both are globally trusted and PCI-DSS compliant. Stripe automatically handles currency conversion so you can pay in USD, EUR, GBP, BDT, and 135+ other currencies. Crypto (USDT) is also accepted.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'If I can\'t deliver what was agreed upon in the project scope, you\'ll receive a full refund. I also offer a free revision round after delivery to make sure you\'re satisfied. Retainer subscriptions can be cancelled anytime with 7 days\' notice.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq">
      <div className="section-inner">
        <span className="section-eyebrow reveal">FAQ</span>
        <h2 className="section-title reveal" style={{ textAlign: 'center' }}>Common questions</h2>
        <div className={styles.list}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`${styles.item} ${open === i ? styles.open : ''} reveal`}
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <button
                className={styles.question}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{faq.q}</span>
                <span className={styles.icon}>{open === i ? '−' : '+'}</span>
              </button>
              <div className={styles.answer}>
                <div className={styles.answerInner}>{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
