import { getCurrentUser } from '@/lib/auth';
import ChangePasswordForm from '@/components/dashboard/ChangePasswordForm';
import styles from '@/components/dashboard/Dashboard.module.css';

export const dynamic = 'force-dynamic';

const ROLE_LABEL = { SUPER_ADMIN: 'Super Admin', ADMIN: 'Admin', USER: 'Member' };

export default async function AccountPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className={styles.pageTitle}>Account settings</h1>
      <p className={styles.pageSub}>Your profile and security.</p>

      <section className={styles.sectionCard}>
        <h2 className={styles.sectionHead}>Profile</h2>
        <table className={styles.table}>
          <tbody>
            <tr><td><strong>Name</strong></td><td>{user.name}</td></tr>
            <tr><td><strong>Email</strong></td><td>{user.email}</td></tr>
            <tr><td><strong>Role</strong></td><td>{ROLE_LABEL[user.role]}</td></tr>
          </tbody>
        </table>
      </section>

      <section className={styles.sectionCard}>
        <h2 className={styles.sectionHead}>Change password</h2>
        <p className={styles.sectionDesc}>Use a long, unique password. Try the Suggest button for a strong one.</p>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
