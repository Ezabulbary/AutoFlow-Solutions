# AutoFlow Solutions

A unique, animated, **payment-ready SaaS landing page** for a business-automation service — built with Next.js 16 (App Router, Turbopack) and React 19.

It ships fully working in **demo mode** (no API keys required) and goes live with real payments by adding a few environment variables. No code changes needed to deploy and start selling.

## ✨ Highlights

- **Animated experience** — scroll-progress bar, scroll-reveal sections, an animated "live workflow" automation pipeline in the hero, count-up stats, infinite tools marquee, gradient headlines, and micro-interactions throughout. Respects `prefers-reduced-motion`.
- **User accounts + dashboard** — register/login, a personal dashboard with payment history, and three roles (**Super Admin / Admin / Member**). Registration is required before payment, and every purchase is recorded to the user's account.
- **Multi-method checkout** — Card (Stripe), PayPal, Crypto (Coinbase Commerce) and Bank Transfer (Wire / bKash / Nagad), in a polished modal.
- **Hardened security** — bcrypt password hashing, signed httpOnly session cookies, server-side role enforcement, CSRF/Origin checks, rate limiting + account lockout, strong-password policy & generator, server-derived prices (no tampering), and security headers (CSP, HSTS, X-Frame-Options).
- **Demo-safe by default** — simulates the full purchase flow so you can deploy and showcase instantly. Flip one env var to go live.

## 👤 Accounts, roles & dashboard

- **Members** can buy plans and view their own payment history.
- **Admins** can suspend / re-activate / delete member accounts.
- **Super Admins** can do everything, including assigning roles to anyone.
- Whoever registers with the email in `SUPER_ADMIN_EMAIL` (default `ezabul.bary@gmail.com`) automatically becomes the Super Admin.

Routes: `/register`, `/login`, `/dashboard`, `/dashboard/account`, `/dashboard/admin`.

## 🗄️ Database setup (required for accounts)

Accounts, roles and payment history are stored in **Postgres**. Tables are created automatically on first run — no migration step.

1. Create a free Postgres database — [Neon](https://neon.tech) (recommended) or [Supabase](https://supabase.com/database).
2. Copy the connection string into `DATABASE_URL` in `.env.local`.
3. Generate a session secret: `openssl rand -base64 48` → `SESSION_SECRET`.
4. (Optional) change `SUPER_ADMIN_EMAIL`.

See `.env.example` for all variables.

## 🚀 Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Build & run the production server:

```bash
npm run build
npm run start
```

## 💳 Going live with payments

The site runs in **demo mode** until you opt in. To accept real payments:

1. Copy the env template and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
2. Add your **Stripe**, **Coinbase Commerce**, and/or **PayPal** keys (see `.env.example` for where to get each).
3. Set `NEXT_PUBLIC_DEMO_MODE=false`. This switches the API routes to real charges and hides all demo banners/test hints.
4. Redeploy. That's it — you're taking payments.

> Leave `NEXT_PUBLIC_DEMO_MODE=true` (or unset) for safe demos and screenshots.

## ☁️ Deploy

Works on any Next.js host. The fastest path is [Vercel](https://vercel.com/new):

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Add the environment variables from `.env.example` in the Vercel dashboard.
4. Deploy.

## 🗂️ Structure

```
app/
  layout.js              # fonts, SEO/OG metadata, AuthProvider
  page.js                # landing section composition
  register/ login/       # auth pages
  dashboard/             # user dashboard, account, admin (role-guarded)
  api/auth/*             # register, login, logout, me
  api/admin/users/[id]/  # role-enforced user management
  api/payments/          # auth-gated payment recording
  api/stripe | coinbase  # gateway checkout (demo-aware, price-safe)
lib/
  db.js                  # Postgres client + auto schema bootstrap
  auth.js                # hashing, sessions, role hierarchy
  users.js / payments.js # data access
  validation.js          # zod schemas
  rateLimit.js http.js   # rate limiting + CSRF/origin helpers
  passwordClient.js      # strength meter + strong-password generator
components/
  ScrollFX.js Hero.js Marquee.js CountUp.js   # animated landing
  AuthProvider.js        # client auth context
  auth/ dashboard/       # auth forms + dashboard UI
  PaymentModal.js        # multi-method checkout
```

Built by **Ezabul Bari** — web developer & automation expert.
