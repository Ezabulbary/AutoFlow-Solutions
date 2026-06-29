import { redirect } from 'next/navigation';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { listUsers } from '@/lib/users';
import UserTable from '@/components/dashboard/UserTable';
import styles from '@/components/dashboard/Dashboard.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const actor = await getCurrentUser();
  if (!actor || !isAdmin(actor.role)) redirect('/dashboard');

  const rows = await listUsers();
  // Super admin accounts are hidden from everyone — never listed or manageable here.
  const users = rows
    .filter((u) => u.role !== 'SUPER_ADMIN')
    .map((u) => ({
    id: String(u.id),
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    created_at: u.created_at,
    paidCount: Number(u.paid_count),
    totalPaid: Number(u.total_paid),
  }));

  return (
    <div>
      <h1 className={styles.pageTitle}>User management</h1>
      <p className={styles.pageSub}>
        {actor.role === 'SUPER_ADMIN'
          ? 'As super admin you can manage every account and assign roles.'
          : 'As admin you can manage member accounts.'}
      </p>

      <section className={styles.sectionCard}>
        <h2 className={styles.sectionHead}>All users ({users.length})</h2>
        <p className={styles.sectionDesc}>Suspend, re-activate, delete, and (super admin only) change roles.</p>
        <UserTable actor={{ id: String(actor.id), role: actor.role }} users={users} />
      </section>
    </div>
  );
}
