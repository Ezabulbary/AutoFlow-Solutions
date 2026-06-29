'use client';

import { useState } from 'react';
import styles from './Pricing.module.css';

const TIER_LABELS = { low: 'Basic', mid: 'Standard', high: 'Premium' };

const plans = [
  {
    badge: 'Starter',
    name: 'One-time Project',
    tiers: { low: 200, mid: 350, high: 500 },
    suffix: '',
    desc: 'For freelancers and small businesses with a single automation need.',
    features: [
      'Single workflow setup',
      '1 platform integration',
      'Video walkthrough included',
      '7 days post-launch support',
      'Full documentation handover',
    ],
    featured: false,
  },
  {
    badge: '✦ Most popular',
    name: 'Growth Project',
    tiers: { low: 500, mid: 1000, high: 1500 },
    suffix: '',
    desc: 'For growing businesses needing multi-step automation systems and integrations.',
    features: [
      'Up to 5 workflows',
      'Multi-platform setup',
      'Error handling & alerts',
      '30 days post-launch support',
      'Full documentation handover',
    ],
    featured: true,
  },
  {
    badge: 'Retainer',
    name: 'Monthly Partner',
    tiers: { low: 500, mid: 750, high: 1000 },
    suffix: '/mo',
    desc: 'Ongoing automation management, new workflows, and priority support every month.',
    features: [
      'Unlimited small task requests',
      'Priority response within 12h',
      'Monthly strategy call',
      'Full documentation handover',
      'Cancel anytime',
    ],
    featured: false,
  },
];

function PricingCard({ plan, onSelectPlan }) {
  const [tier, setTier] = useState('low');
  const price = plan.tiers[tier];

  return (
    <div className={`${styles.card} ${plan.featured ? styles.featured : ''} reveal reveal-scale`}>
      <span className={styles.badge}>{plan.badge}</span>
      <div className={styles.name}>{plan.name}</div>

      <div className={styles.price}>
        ${price.toLocaleString()}<span>{plan.suffix}</span>
      </div>

      <div className={styles.tierRow}>
        {['low', 'mid', 'high'].map((t) => (
          <button
            key={t}
            type="button"
            className={`${styles.tierBtn} ${tier === t ? styles.tierActive : ''}`}
            onClick={() => setTier(t)}
          >
            {TIER_LABELS[t]}
          </button>
        ))}
      </div>

      <div className={styles.desc}>{plan.desc}</div>
      <div className={styles.divider} />
      <ul className={styles.features}>
        {plan.features.map((f) => (
          <li key={f} className={styles.feature}>
            <span className={styles.check}>✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={`${styles.btn} ${plan.featured ? styles.btnFeatured : ''}`}
        onClick={() => onSelectPlan(plan.name, tier)}
      >
        Get started
      </button>
    </div>
  );
}

export default function Pricing({ onSelectPlan }) {
  return (
    <section id="pricing" style={{ background: 'var(--bg-white)' }}>
      <div className="section-inner">
        <span className="section-eyebrow reveal">Pricing</span>
        <h2 className="section-title reveal">Transparent pricing, no surprises</h2>
        <p className="section-sub reveal">
          Pick a tier for each plan: Basic, Standard, or Premium. Every plan includes full documentation handover and support.
        </p>
        <div className={styles.grid}>
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} onSelectPlan={onSelectPlan} />
          ))}
        </div>

        <div className={`${styles.policy} reveal`}>
          <strong>Cancel anytime.</strong> If we&apos;ve already started work, a percentage is deducted for the work
          completed and the remainder is refunded. If no work has begun yet, you get a full refund.
        </div>

        <p className={styles.note}>
          💡 Need something custom?{' '}
          <button type="button" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className={styles.noteLink}>
            Contact us for a quote →
          </button>
        </p>
      </div>
    </section>
  );
}
