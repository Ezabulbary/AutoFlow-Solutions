import { getCurrentUser } from '@/lib/auth';
import { listPaymentsByUser } from '@/lib/payments';
import BillingPanel from '@/components/dashboard/BillingPanel';
import PaymentHistory from '@/components/dashboard/PaymentHistory';
import styles from '@/components/dashboard/Dashboard.module.css';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  const payments = await listPaymentsByUser(user.id);

  const paid = payments.filter((p) => p.status === 'PAID');
  const totalSpent = paid.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div>
      <h1 className={styles.pageTitle}>Welcome back, {user.name.split(' ')[0]} 👋</h1>
      <p className={styles.pageSub}>Manage your plans and review your payment history.</p>

      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total spent</div>
          <div className={styles.statValue}>${totalSpent.toFixed(2)}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Paid orders</div>
          <div className={styles.statValue}>{paid.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total orders</div>
          <div className={styles.statValue}>{payments.length}</div>
        </div>
      </div>

      <section className={styles.sectionCard}>
        <h2 className={styles.sectionHead}>Choose a plan</h2>
        <p className={styles.sectionDesc}>Pick a plan to pay securely. Your purchase is added to your history.</p>
        <BillingPanel preselected={sp?.plan || null} />
      </section>

      <section className={styles.sectionCard}>
        <h2 className={styles.sectionHead}>Payment history</h2>
        <p className={styles.sectionDesc}>Every transaction tied to your account.</p>
        <PaymentHistory payments={payments} />
      </section>
    </div>
  );
}
