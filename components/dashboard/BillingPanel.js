'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PaymentModal from '@/components/PaymentModal';
import Toast from '@/components/Toast';
import { PLANS, TIERS, resolvePlanAmount, resolveCustomAmount, CUSTOM_MIN, CUSTOM_MAX } from '@/lib/pricing';
import styles from './Dashboard.module.css';

const TIER_LABELS = { low: 'Basic', mid: 'Standard', high: 'Premium' };
const DISPLAY = {
  'One-time Project': 'Single workflow · 7-day support',
  'Growth Project': 'Up to 5 workflows · 30-day support',
  'Monthly Partner': 'Ongoing retainer · priority support',
};

export default function BillingPanel({ preselected, preselectedTier }) {
  const router = useRouter();
  const [order, setOrder] = useState(null); // { plan, tier, amount, label }
  const [tiers, setTiers] = useState({});
  const [toast, setToast] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [customLabel, setCustomLabel] = useState('');

  function showToast(msg, icon = '✅') {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 4000);
  }

  // Open the modal automatically if a plan was preselected from the landing page.
  useEffect(() => {
    if (preselected && PLANS[preselected]) {
      const tier = TIERS.includes(preselectedTier) ? preselectedTier : 'low';
      setOrder({ plan: preselected, tier, amount: resolvePlanAmount(preselected, tier) });
    }
  }, [preselected, preselectedTier]);

  const tierFor = (plan) => tiers[plan] || 'low';
  const setTierFor = (plan, t) => setTiers((p) => ({ ...p, [plan]: t }));

  function startCustom() {
    const amt = resolveCustomAmount(customAmount);
    if (amt === null) {
      showToast(`❌ Enter an amount between $${CUSTOM_MIN} and $${CUSTOM_MAX}.`);
      return;
    }
    setOrder({ plan: 'Custom', tier: 'low', amount: amt, label: customLabel.trim() || 'Custom package' });
  }

  return (
    <>
      <div className={styles.planGrid}>
        {Object.keys(PLANS).map((plan) => {
          const tier = tierFor(plan);
          const amount = resolvePlanAmount(plan, tier);
          return (
            <div key={plan} className={styles.planCard}>
              <div className={styles.planName}>{plan}</div>
              <div className={styles.planPrice}>${amount.toLocaleString()}</div>
              <div className={styles.tierMini}>
                {TIERS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`${styles.tierMiniBtn} ${tier === t ? styles.tierMiniActive : ''}`}
                    onClick={() => setTierFor(plan, t)}
                  >
                    {TIER_LABELS[t]}
                  </button>
                ))}
              </div>
              <div className={styles.planMeta}>{DISPLAY[plan]}</div>
              <button
                type="button"
                className={styles.planBuy}
                onClick={() => setOrder({ plan, tier, amount })}
              >
                Pay ${amount.toLocaleString()}
              </button>
            </div>
          );
        })}
      </div>

      {/* Custom package builder */}
      <div className={styles.customBox}>
        <h3 className={styles.customTitle}>🧩 Build a custom package</h3>
        <p className={styles.customSub}>Set your own scope and amount, then continue to a secure payment.</p>
        <div className={styles.customRow}>
          <input
            className="form-input"
            placeholder="Package description (e.g. 3 custom workflows)"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            maxLength={120}
          />
          <input
            className="form-input"
            type="number"
            min={CUSTOM_MIN}
            max={CUSTOM_MAX}
            placeholder={`Amount ($${CUSTOM_MIN}-$${CUSTOM_MAX})`}
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />
          <button type="button" className={styles.planBuy} onClick={startCustom}>
            Continue →
          </button>
        </div>
      </div>

      {order && (
        <PaymentModal
          plan={order.plan}
          amount={order.amount}
          tier={order.tier}
          label={order.label}
          onClose={() => setOrder(null)}
          showToast={showToast}
          onPaid={() => {
            setOrder(null);
            showToast('✅ Payment recorded! See it in your history below.');
            router.refresh();
          }}
        />
      )}
      <Toast toast={toast} />
    </>
  );
}
