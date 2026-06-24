import 'server-only';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getFullUserById } from './users';

export const ROLES = { SUPER_ADMIN: 'SUPER_ADMIN', ADMIN: 'ADMIN', USER: 'USER' };
export const SUPER_ADMIN_EMAIL = (process.env.SUPER_ADMIN_EMAIL || 'ezabul.bary@gmail.com')
  .trim()
  .toLowerCase();

const COOKIE_NAME = 'af_session';
const SESSION_DAYS = 7;
const BCRYPT_ROUNDS = 12;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be set to a random string of at least 32 characters.');
  }
  return new TextEncoder().encode(secret);
}

// ── Passwords ──
export function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}
export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/** Server-side password policy. Returns { valid, errors[] }. */
export function validatePassword(password) {
  const errors = [];
  if (typeof password !== 'string' || password.length < 10) errors.push('At least 10 characters');
  if (!/[a-z]/.test(password || '')) errors.push('A lowercase letter');
  if (!/[A-Z]/.test(password || '')) errors.push('An uppercase letter');
  if (!/[0-9]/.test(password || '')) errors.push('A number');
  if (!/[^A-Za-z0-9]/.test(password || '')) errors.push('A symbol');
  if ((password || '').length > 200) errors.push('Too long (max 200)');
  return { valid: errors.length === 0, errors };
}

// ── Sessions (stateless JWT in an httpOnly cookie) ──
async function signSession(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

export async function startSession(user) {
  const token = await signSession({ sub: String(user.id), role: user.role });
  const store = await cookies();
  store.set(COOKIE_NAME, token, cookieOptions());
}

/** Build the session cookie descriptor for setting on a NextResponse (used by OAuth redirects). */
export async function buildSessionCookie(user) {
  const token = await signSession({ sub: String(user.id), role: user.role });
  return { name: COOKIE_NAME, value: token, options: cookieOptions() };
}

export async function destroySession() {
  const store = await cookies();
  store.set(COOKIE_NAME, '', { ...cookieOptions(), maxAge: 0 });
}

async function readSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] });
    return payload;
  } catch {
    return null;
  }
}

/**
 * Resolve the current user from the session, re-reading the DB so role changes
 * and suspensions take effect immediately. Suspended accounts are rejected.
 * Returns a safe public user object (no password hash) or null.
 */
export async function getCurrentUser() {
  const session = await readSession();
  if (!session?.sub) return null;
  const user = await getFullUserById(session.sub);
  if (!user || user.status === 'SUSPENDED') return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status };
}

// ── Role hierarchy ──
export function isAdmin(role) {
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}
export function isSuperAdmin(role) {
  return role === ROLES.SUPER_ADMIN;
}

/** Whether `actor` is allowed to manage (suspend/activate/delete) `target`. */
export function canManageUser(actor, target) {
  if (!actor || !target) return false;
  if (String(actor.id) === String(target.id)) return false; // never act on self here
  if (actor.role === ROLES.SUPER_ADMIN) return true;
  if (actor.role === ROLES.ADMIN) return target.role === ROLES.USER;
  return false;
}

/** Only super admins may change roles. */
export function canChangeRole(actor) {
  return actor?.role === ROLES.SUPER_ADMIN;
}

export const COOKIE = COOKIE_NAME;
