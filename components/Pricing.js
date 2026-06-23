import styles from './Pricing.module.css';

const plans = [
  {
    badge: 'Starter',
    name: 'One-time Project',
    price: '$200',
    priceSuffix: '– $500',
    desc: 'For freelancers and small businesses with a single automation need.',
    features: [
      'Single workflow setup',
      '1 platform integration',
      'Video walkthrough included',
      '7 days post-launch support',
      'Full documentation',
    ],
    cta: 'Get started',
    featured: false,
    amount: 200,
  },
  {
    badge: '✦ Most popular',
    name: 'Growth Project',
    price: '$500',
    priceSuffix: '– $1,500',
    desc: 'For growing businesses needing multi-step automation systems and integrations.',
    features: [
      'Up to 5 workflows',
      'Multi-platform setup',
      'Error handling & alerts',
      '30 days post-launch support',
      'Recorded handover session',
    ],
    cta: 'Get started',
    featured: true,
    amount: 500,
  },
  {
    badge: 'Retainer',
    name: 'Monthly Partner',
    price: '$300',
    priceSuffix: '– $800/mo',
    desc: 'Ongoing automation management, new workflows, and priority support every month.',
    features: [
      'Unlimited small task requests',
      'Priority response within 12h',
      'Monthly strategy call',
      'Proactive workflow monitoring',
      'Cancel anytime',
    ],
    cta: 'Get started',
    featured: false,
    amount: 300,
  },
];

export default function Pricing({ onSelectPlan }) {
  return (
    <section id="pricing" style={{ background: 'var(--bg-white)' }}>
      <div className="section-inner">
        <span className="section-eyebrow reveal">Pricing</span>
        <h2 className="section-title reveal">Transparent pricing, no surprises</h2>
        <p className="section-sub reveal">Three plans for every stage of business growth. All include delivery documentation and support.</p>
        <div className={styles.grid}>
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`${styles.card} ${plan.featured ? styles.featured : ''} reveal reveal-scale`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <span className={styles.badge}>{plan.badge}</span>
              <div className={styles.name}>{plan.name}</div>
              <div className={styles.price}>
                {plan.price} <span>{plan.priceSuffix}</span>
              </div>
              <div className={styles.desc}>{plan.desc}</div>
              <div className={styles.divider} />
              <ul className={styles.features}>
                {plan.features.map(f => (
                  <li key={f} className={styles.feature}>
                    <span className={styles.check}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`${styles.btn} ${plan.featured ? styles.btnFeatured : ''}`}
                onClick={() => onSelectPlan(plan.name, plan.amount)}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
        <p className={styles.note}>
          💡 Custom enterprise projects? <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className={styles.noteLink}>Contact me for a quote →</button>
        </p>
      </div>
    </section>
  );
}
