import mongoose from 'mongoose';
import { createHash, randomBytes } from 'crypto';
import { connectDB } from './mongoose';
import { User } from './models/User';
import { Payment } from './models/Payment';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function hashToken(raw) {
  return createHash('sha256').update(raw).digest('hex');
}

// Map a Mongoose user doc to the snake_case shape the app consumes.
function pub(u) {
  if (!u) return null;
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    provider: u.provider,
    created_at: u.createdAt,
  };
}
function full(u) {
  if (!u) return null;
  return {
    ...pub(u),
    password_hash: u.passwordHash,
    failed_attempts: u.failedAttempts,
    locked_until: u.lockedUntil,
  };
}
function validId(id) {
  return mongoose.isValidObjectId(id);
}

export async function createUser({ name, email, passwordHash = null, role = 'USER', provider = 'local', googleId = null }) {
  await connectDB();
  const u = await User.create({ name, email: normalizeEmail(email), passwordHash, role, provider, googleId });
  return pub(u);
}

export async function getUserByEmail(email) {
  await connectDB();
  const u = await User.findOne({ email: normalizeEmail(email) }).lean();
  return full(u);
}

export async function getUserById(id) {
  await connectDB();
  if (!validId(id)) return null;
  const u = await User.findById(id).lean();
  return pub(u);
}

export async function getFullUserById(id) {
  await connectDB();
  if (!validId(id)) return null;
  const u = await User.findById(id).lean();
  return full(u);
}

export async function listUsers() {
  await connectDB();
  const rows = await User.aggregate([
    { $lookup: { from: 'payments', localField: '_id', foreignField: 'user', as: 'pays' } },
    {
      $addFields: {
        paidPays: { $filter: { input: '$pays', cond: { $eq: ['$$this.status', 'PAID'] } } },
      },
    },
    {
      $addFields: {
        paid_count: { $size: '$paidPays' },
        total_paid: { $sum: '$paidPays.amount' },
      },
    },
    { $sort: { createdAt: -1 } },
    { $project: { name: 1, email: 1, role: 1, status: 1, createdAt: 1, paid_count: 1, total_paid: 1 } },
  ]);
  return rows.map((u) => ({
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    created_at: u.createdAt,
    paid_count: u.paid_count || 0,
    total_paid: u.total_paid || 0,
  }));
}

export async function updateUserRole(id, role) {
  await connectDB();
  if (!validId(id)) return null;
  const u = await User.findByIdAndUpdate(id, { role }, { new: true }).lean();
  return pub(u);
}

export async function updateUserStatus(id, status) {
  await connectDB();
  if (!validId(id)) return null;
  const u = await User.findByIdAndUpdate(id, { status }, { new: true }).lean();
  return pub(u);
}

export async function updateUserPassword(id, passwordHash) {
  await connectDB();
  if (!validId(id)) return;
  await User.findByIdAndUpdate(id, { passwordHash });
}

export async function deleteUser(id) {
  await connectDB();
  if (!validId(id)) return;
  await Payment.deleteMany({ user: id });
  await User.findByIdAndDelete(id);
}

export async function countSuperAdmins() {
  await connectDB();
  return User.countDocuments({ role: 'SUPER_ADMIN' });
}

// ── Brute-force protection at the account level ──
export async function registerFailedLogin(id) {
  await connectDB();
  if (!validId(id)) return null;
  const u = await User.findById(id);
  if (!u) return null;
  u.failedAttempts = (u.failedAttempts || 0) + 1;
  if (u.failedAttempts >= 5) u.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
  await u.save();
  return { failed_attempts: u.failedAttempts, locked_until: u.lockedUntil };
}

export async function resetFailedLogin(id) {
  await connectDB();
  if (!validId(id)) return;
  await User.findByIdAndUpdate(id, { failedAttempts: 0, lockedUntil: null });
}

export function isLocked(user) {
  return Boolean(user?.locked_until && new Date(user.locked_until) > new Date());
}

// ── Password reset (token is hashed at rest; raw token only goes to email) ──
export async function setPasswordReset(email) {
  await connectDB();
  const u = await User.findOne({ email: normalizeEmail(email) });
  // Only local/password accounts can reset a password; skip OAuth-only accounts.
  if (!u || !u.passwordHash) return null;
  const rawToken = randomBytes(32).toString('hex');
  u.resetTokenHash = hashToken(rawToken);
  u.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await u.save();
  return { user: pub(u.toObject()), rawToken };
}

export async function getUserByResetToken(rawToken) {
  await connectDB();
  if (!rawToken) return null;
  const u = await User.findOne({
    resetTokenHash: hashToken(rawToken),
    resetTokenExpires: { $gt: new Date() },
  }).lean();
  return full(u);
}

export async function resetPasswordWithToken(rawToken, passwordHash) {
  await connectDB();
  if (!rawToken) return null;
  // Atomically consume the token so it can't be reused.
  const u = await User.findOneAndUpdate(
    { resetTokenHash: hashToken(rawToken), resetTokenExpires: { $gt: new Date() } },
    { passwordHash, resetTokenHash: null, resetTokenExpires: null, failedAttempts: 0, lockedUntil: null },
    { new: true }
  ).lean();
  return pub(u);
}

// Find-or-create for Google OAuth sign-in.
export async function findOrCreateGoogleUser({ email, name, googleId, role = 'USER' }) {
  await connectDB();
  const normalized = normalizeEmail(email);
  let u = await User.findOne({ email: normalized });
  if (u) {
    if (!u.googleId) {
      u.googleId = googleId;
      if (u.provider === 'local') u.provider = 'google';
      await u.save();
    }
    return full(u.toObject());
  }
  u = await User.create({ name: name || normalized, email: normalized, googleId, provider: 'google', role });
  return full(u.toObject ? u.toObject() : u);
}
