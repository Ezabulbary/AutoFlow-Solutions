// Server-side source of truth for plan pricing.
// Payment routes MUST derive the charge amount from here using the plan name,
// never from a client-supplied amount — otherwise a user could tamper with the
// price (e.g. pay $1 for a $500 plan).
export const PLANS = {
  'One-time Project': { amount: 200 },
  'Growth Project': { amount: 500 },
  'Monthly Partner': { amount: 300 },
};

/**
 * Resolve the trusted amount (USD) for a plan name.
 * Returns null for unknown plans so the caller can reject the request.
 */
export function resolvePlanAmount(plan) {
  if (typeof plan !== 'string') return null;
  const entry = PLANS[plan];
  return entry ? entry.amount : null;
}
