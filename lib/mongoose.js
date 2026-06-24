import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Cache the connection across hot-reloads / serverless invocations.
let cached = globalThis.__af_mongoose;
if (!cached) cached = globalThis.__af_mongoose = { conn: null, promise: null, seeded: false };

export function isDbConfigured() {
  return Boolean(MONGODB_URI);
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured. Set it to your MongoDB Atlas connection string.');
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((m) => m);
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  await ensureSuperAdmin();
  return cached.conn;
}

// Guarantee the designated email always holds the SUPER_ADMIN role (runs once).
async function ensureSuperAdmin() {
  if (cached.seeded) return;
  cached.seeded = true;
  try {
    const { User } = await import('./models/User');
    const superEmail = (process.env.SUPER_ADMIN_EMAIL || 'ezabul.bary@gmail.com').trim().toLowerCase();
    await User.updateOne(
      { email: superEmail, role: { $ne: 'SUPER_ADMIN' } },
      { $set: { role: 'SUPER_ADMIN' } }
    );
  } catch {
    cached.seeded = false; // allow retry on a later request
  }
}
