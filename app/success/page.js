'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';
import styles from './success.module.css';

function SuccessContent() {
  const searchParams = useSearchParams();
  const method = searchParams.get('method') || 'payment';
  const plan = searchParams.get('plan') || 'Automation Workflow';
  const amount = searchParams.get('amount') || '0';

  const isManual = method === 'bank' || method === 'crypto';

  return (
    <div className={styles.container}>
      {/* Background Orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.card}>
        <div className={styles.checkCircle}>
          <Check className={styles.checkIcon} size={40} />
        </div>

        <h1 className={styles.title}>Payment Initiated!</h1>
        <p className={styles.subtitle}>
          Thank you for choosing AutoFlow Solutions. Your project setup has been initiated.
        </p>

        {/* Receipt Box */}
        <div className={styles.receipt}>
          <div className={styles.receiptRow}>
            <span>Service Plan</span>
            <strong>{plan}</strong>
          </div>
          <div className={styles.receiptRow}>
            <span>Amount</span>
            <strong className={styles.amount}>${amount} USD</strong>
          </div>
          <div className={styles.receiptRow}>
            <span>Payment Method</span>
            <span className={styles.badge}>{method.toUpperCase()}</span>
          </div>
          <div className={styles.receiptRow}>
            <span>Status</span>
            <span className={`${styles.statusBadge} ${isManual ? styles.pending : styles.success}`}>
              {isManual ? '⏳ Pending Verification' : '⚡ Paid & Secured'}
            </span>
          </div>
        </div>

        {/* Information Notice */}
        <div className={styles.notice}>
          <ShieldCheck className={styles.noticeIcon} size={20} />
          <p>
            {isManual
              ? 'We are verifying your transaction. Once verified, you will receive your project kickoff email.'
              : 'Your payment was processed. A receipt and confirmation has been sent to your email.'}
          </p>
        </div>

        {/* Next Steps */}
        <div className={styles.nextSteps}>
          <h3 className={styles.nextStepsTitle}>🚀 What happens next?</h3>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div>
              <h4 className={styles.stepTitle}>Slack Collaboration Channel</h4>
              <p className={styles.stepDesc}>We will invite you to your private Slack workspace channel within 2 hours to start collaborating.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div>
              <h4 className={styles.stepTitle}>Kickoff Call Invitation</h4>
              <p className={styles.stepDesc}>Check your inbox for a scheduling link to set up our 30-minute project kickoff and strategy call.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>
            Return to Homepage <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading confirmation details...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
