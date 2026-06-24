'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PaymentModal from '@/components/PaymentModal';
import Toast from '@/components/Toast';
import { PLANS, resolvePlanAmount } from '@/lib/pricing';
import styles from './Dashboard.module.css';

const DISPLAY = {
  'One-time Project': { meta: 'Single workflow · 7-day support' },
  'Growth Project': { meta: 'Up to 5 workflows · 30-day support' },
  'Monthly Partner': { meta: 'Ongoing retainer · priority support' },
};

export default function BillingPanel({ preselected }) {
  const router = useRouter();
  const [active, setActive] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(msg, icon = '✅') {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 4000);
  }

  // Open the modal automatically if a plan was preselected from the landing page.
  useEffect(() => {
    if (preselected && PLANS[preselected]) setActive(preselected);
  }, [preselected]);

  return (
    <>
      <div className={styles.planGrid}>
        {Object.keys(PLANS).map((plan) => (
          <button key={plan} className={styles.planCard} onClick={() => setActive(plan)}>
            <div className={styles.planName}>{plan}</div>
            <div className={styles.planPrice}>${resolvePlanAmount(plan)}</div>
            <div className={styles.planMeta}>{DISPLAY[plan]?.meta}</div>
          </button>
        ))}
      </div>

      {active && (
        <PaymentModal
          plan={active}
          amount={resolvePlanAmount(active)}
          onClose={() => setActive(null)}
          showToast={showToast}
          onPaid={() => {
            setActive(null);
            showToast('✅ Payment recorded! See it in your history below.');
            router.refresh();
          }}
        />
      )}
      <Toast toast={toast} />
    </>
  );
}
