import { getCurrentUser, isAdmin, canManageUser, canChangeRole, ROLES } from '@/lib/auth';
import {
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  countSuperAdmins,
} from '@/lib/users';
import { sameOrigin, ok, fail, forbidden } from '@/lib/http';

async function loadActorAndTarget(req, id) {
  if (!sameOrigin(req)) return { resp: forbidden('Invalid origin') };
  const actor = await getCurrentUser();
  if (!actor) return { resp: fail('Not authenticated', 401) };
  if (!isAdmin(actor.role)) return { resp: forbidden('Admins only') };
  const target = await getUserById(id);
  if (!target) return { resp: fail('User not found', 404) };
  return { actor, target };
}

export async function PATCH(req, { params }) {
  const { id } = await params;
  const { actor, target, resp } = await loadActorAndTarget(req, id);
  if (resp) return resp;

  let body;
  try {
    body = await req.json();
  } catch {
    return fail('Invalid request body');
  }
  const action = body?.action;

  if (action === 'role') {
    if (!canChangeRole(actor)) return forbidden('Only a super admin can change roles');
    if (String(actor.id) === String(target.id)) return forbidden('You cannot change your own role');
    const role = body.role;
    if (![ROLES.USER, ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role)) return fail('Invalid role');
    // Don't allow removing the last super admin.
    if (target.role === ROLES.SUPER_ADMIN && role !== ROLES.SUPER_ADMIN) {
      if ((await countSuperAdmins()) <= 1) return forbidden('At least one super admin is required');
    }
    const updated = await updateUserRole(target.id, role);
    return ok({ user: updated });
  }

  if (action === 'suspend' || action === 'activate') {
    if (!canManageUser(actor, target)) return forbidden('You cannot manage this user');
    const status = action === 'suspend' ? 'SUSPENDED' : 'ACTIVE';
    const updated = await updateUserStatus(target.id, status);
    return ok({ user: updated });
  }

  return fail('Unknown action');
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const { actor, target, resp } = await loadActorAndTarget(req, id);
  if (resp) return resp;

  if (!canManageUser(actor, target)) return forbidden('You cannot delete this user');
  if (target.role === ROLES.SUPER_ADMIN && (await countSuperAdmins()) <= 1) {
    return forbidden('At least one super admin is required');
  }
  await deleteUser(target.id);
  return ok({ ok: true });
}
