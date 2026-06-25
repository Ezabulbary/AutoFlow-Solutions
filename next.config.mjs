/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== 'production';

// Pragmatic, app-compatible security headers. CSP allows Stripe's hosted
// checkout/JS and the Coinbase/Stripe APIs; everything else defaults to 'self'.
// In development, Next.js/Turbopack + React need 'unsafe-eval' and a websocket
// connection for hot-reload — these are added ONLY in dev, never in production.
const csp = [
  "default-src 'self'",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline' https://js.stripe.com${isDev ? " 'unsafe-eval'" : ''}`,
  "font-src 'self' data:",
  `connect-src 'self' https://api.stripe.com https://api.commerce.coinbase.com${isDev ? ' ws: wss:' : ''}`,
  "frame-src https://js.stripe.com https://checkout.stripe.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
