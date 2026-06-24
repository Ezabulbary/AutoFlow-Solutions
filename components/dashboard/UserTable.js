'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

const ROLES = ['USER', 'ADMIN', 'SUPER_ADMIN'];
const ROLE_LABEL = { SUPER_ADMIN: 'Super Admin', ADMIN: 'Admin', USER: 'Member' };

// Mirror of server-side canManageUser for UI affordances (server still enforces).
function canManage(actor, target) {
  if (String(actor.id) === String(target.id)) return false;
  if (actor.role === 'SUPER_ADMIN') return true;
  if (actor.role === 'ADMIN') return target.role === 'USER';
  return false;
}

export default function UserTable({ actor, users }) {
  const router = useRouter();
  const [pending, setPending] = useState(null);
  const [error, setError] = useState('');

  async function act(id, method, body) {
    setPending(id);
    setError('');
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Action failed');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(null);
    }
  }

  function onDelete(u) {
    if (window.confirm(`Delete ${u.email}? This cannot be undone.`)) {
      act(u.id, 'DELETE');
    }
  }

  const canSetRole = actor.role === 'SUPER_ADMIN';

  return (
    <div>
      {error && <div className={`${styles.notice} ${styles.noticeErr}`} style={{ marginBottom: 12 }}>{error}</div>}
      <div style={{ overflowX: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Paid</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const self = String(u.id) === String(actor.id);
              const manage = canManage(actor, u);
              const busy = pending === u.id;
              return (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{u.name} {self && <span style={{ color: 'var(--text-faint)' }}>(you)</span>}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{u.email}</div>
                  </td>
                  <td>
                    {canSetRole && !self ? (
                      <select
                        className={styles.roleSelect}
                        value={u.role}
                        disabled={busy}
                        onChange={(e) => act(u.id, 'PATCH', { action: 'role', role: e.target.value })}
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                      </select>
                    ) : (
                      ROLE_LABEL[u.role]
                    )}
                  </td>
                  <td><span className={`${styles.badge} ${styles[`badge_${u.status}`]}`}>{u.status}</span></td>
                  <td>{u.paidCount} · ${u.totalPaid.toFixed(2)}</td>
                  <td>
                    <div className={styles.actions}>
                      {u.status === 'ACTIVE' ? (
                        <button className={styles.miniBtn} disabled={!manage || busy}
                          onClick={() => act(u.id, 'PATCH', { action: 'suspend' })}>Suspend</button>
                      ) : (
                        <button className={styles.miniBtn} disabled={!manage || busy}
                          onClick={() => act(u.id, 'PATCH', { action: 'activate' })}>Activate</button>
                      )}
                      <button className={`${styles.miniBtn} ${styles.miniDanger}`} disabled={!manage || busy}
                        onClick={() => onDelete(u)}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
