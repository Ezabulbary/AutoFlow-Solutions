import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true }, // stripe | paypal | crypto | bank
    status: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
    reference: { type: String, default: null },
  },
  { timestamps: true }
);

export const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
