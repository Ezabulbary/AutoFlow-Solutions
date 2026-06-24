// Lightweight in-memory rate limiter for auth endpoints.
// Note: on serverless this is per-instance and resets on cold start. It still
// blunts rapid brute-force bursts; account-level lockout (see lib/users.js)
// provides durable protection. For a hardened multi-instance setup, back this
// with Redis/Upstash.
const buckets = new Map();

/**
 * @returns {{ allowed: boolean, retryAfter: number }}
 */
export function rateLimit(key, { limit = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  entry.count += 1;
  if (entry.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((entry.reset - now) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

export function getClientIp(req) {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

// Opportunistically drop expired buckets so the map can't grow unbounded.
export function sweepRateLimiter() {
  const now = Date.now();
  for (const [key, entry] of buckets) {
    if (now > entry.reset) buckets.delete(key);
  }
}
