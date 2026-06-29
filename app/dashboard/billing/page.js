import { getCurrentUser } from '@/lib/auth';
import { listPaymentsByUser } from '@/lib/payments';
import BillingPanel from '@/components/dashboard/BillingPanel';
import PaymentHistory from '@/components/dashboard/PaymentHistory';
import styles from '@/components/dashboard/Dashboard.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Billing & plans | AutoFlow Solutions',
  robots: { index: false },
};

export default async function BillingPage({ searchParams }) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  const payments = await listPaymentsByUser(user.id);

  return (
    <div>
      <h1 className={styles.pageTitle}>Billing & plans</h1>
      <p className={styles.pageSub}>Choose a plan, pay securely, and review every transaction.</p>

      <section className={styles.sectionCard}>
        <h2 className={styles.sectionHead}>Choose a plan</h2>
        <p className={styles.sectionDesc}>Pick a plan to pay securely. Your purchase is added to your history.</p>
        <BillingPanel preselected={sp?.plan || null} preselectedTier={sp?.tier || null} />
      </section>

      <section className={styles.sectionCard}>
        <h2 className={styles.sectionHead}>Payment history</h2>
        <p className={styles.sectionDesc}>Every transaction tied to your account.</p>
        <PaymentHistory payments={payments} />
      </section>
    </div>
  );
}
