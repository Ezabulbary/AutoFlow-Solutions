// Server-side source of truth for plan pricing.
// Payment routes MUST derive the charge amount from here, never from a
// client-supplied amount (except a bounded "Custom" amount) — otherwise a user
// could tamper with the price (e.g. pay $1 for a $500 plan).

export const TIERS = ['low', 'mid', 'high'];

export const PLANS = {
  'One-time Project': { tiers: { low: 200, mid: 350, high: 500 } },
  'Growth Project': { tiers: { low: 500, mid: 1000, high: 1500 } },
  'Monthly Partner': { tiers: { low: 500, mid: 750, high: 1000 } },
};

// Bounds for the dashboard "custom package" builder.
export const CUSTOM_MIN = 25;
export const CUSTOM_MAX = 50000;

/**
 * Resolve the trusted amount (USD) for a plan name + tier.
 * Returns null for unknown plans so the caller can reject the request.
 */
export function resolvePlanAmount(plan, tier = 'low') {
  if (typeof plan !== 'string') return null;
  const entry = PLANS[plan];
  if (!entry) return null;
  return entry.tiers[tier] ?? entry.tiers.low;
}

/** Validate a custom amount within bounds; returns a rounded integer or null. */
export function resolveCustomAmount(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return null;
  const r = Math.round(n);
  if (r < CUSTOM_MIN || r > CUSTOM_MAX) return null;
  return r;
}

/** Unified resolver used by every payment route. */
export function resolveAmount({ plan, tier, amount }) {
  if (plan === 'Custom') return resolveCustomAmount(amount);
  return resolvePlanAmount(plan, tier);
}

/** Human label stored on the payment record. */
export function paymentLabel({ plan, tier, label }) {
  if (plan === 'Custom') return (label && String(label).trim()) || 'Custom package';
  const tierName = TIERS.includes(tier) ? tier : 'low';
  return `${plan} (${tierName})`;
}
