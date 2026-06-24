import mongoose from 'mongoose';
import { connectDB } from './mongoose';
import { Payment } from './models/Payment';

function map(p) {
  if (!p) return null;
  return {
    id: String(p._id),
    user_id: String(p.user),
    plan: p.plan,
    amount: p.amount,
    method: p.method,
    status: p.status,
    reference: p.reference,
    created_at: p.createdAt,
  };
}

export async function createPayment({ userId, plan, amount, method, status = 'PENDING', reference = null }) {
  await connectDB();
  const p = await Payment.create({ user: userId, plan, amount, method, status, reference });
  return map(p.toObject());
}

export async function updatePaymentStatus(id, status) {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) return null;
  const p = await Payment.findByIdAndUpdate(id, { status }, { new: true }).lean();
  return map(p);
}

export async function listPaymentsByUser(userId) {
  await connectDB();
  if (!mongoose.isValidObjectId(userId)) return [];
  const rows = await Payment.find({ user: userId }).sort({ createdAt: -1 }).lean();
  return rows.map(map);
}

export async function listAllPayments() {
  await connectDB();
  const rows = await Payment.find().populate('user', 'name email').sort({ createdAt: -1 }).lean();
  return rows.map((p) => ({
    ...map(p),
    user_name: p.user?.name,
    user_email: p.user?.email,
  }));
}

export async function getPaymentById(id) {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) return null;
  const p = await Payment.findById(id).lean();
  return map(p);
}
