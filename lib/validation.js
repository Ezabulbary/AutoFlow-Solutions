import { z } from 'zod';

export const emailSchema = z.string().trim().toLowerCase().email('Enter a valid email').max(200);

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(80),
  email: emailSchema,
  password: z.string().min(10, 'Password is too short').max(200),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(200),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(10).max(200),
});

export const PLAN_NAMES = ['One-time Project', 'Growth Project', 'Monthly Partner'];

export const paymentSchema = z.object({
  plan: z.enum(PLAN_NAMES),
  method: z.enum(['stripe', 'paypal', 'crypto', 'bank']),
});

/** Parse and return { data } or { error } with a friendly first message. */
export function safeParse(schema, input) {
  const result = schema.safeParse(input);
  if (result.success) return { data: result.data };
  const first = result.error.issues[0];
  return { error: first?.message || 'Invalid input' };
}
