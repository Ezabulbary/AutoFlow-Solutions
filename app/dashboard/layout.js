import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import DashboardShell from '@/components/dashboard/DashboardShell';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard — AutoFlow Solutions',
  robots: { index: false },
};

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/dashboard');
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
