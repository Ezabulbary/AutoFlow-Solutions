# AutoFlow Solutions

A unique, animated, **payment-ready SaaS landing page** for a business-automation service — built with Next.js 16 (App Router, Turbopack) and React 19.

It ships fully working in **demo mode** (no API keys required) and goes live with real payments by adding a few environment variables. No code changes needed to deploy and start selling.

## ✨ Highlights

- **Animated experience** — scroll-progress bar, scroll-reveal sections, an animated "live workflow" automation pipeline in the hero, count-up stats, infinite tools marquee, gradient headlines, and micro-interactions throughout. Respects `prefers-reduced-motion`.
- **Multi-method checkout** — Card (Stripe), PayPal, Crypto (Coinbase Commerce) and Bank Transfer (Wire / bKash / Nagad), in a polished modal.
- **Demo-safe by default** — simulates the full purchase flow so you can deploy and showcase instantly. Flip one env var to go live.
- **Production-ready** — clean App Router structure, SEO/OpenGraph metadata, accessible, responsive, and zero build warnings.

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
  layout.js              # fonts, SEO/OG metadata
  page.js                # section composition
  globals.css            # design system + animation utilities
  api/stripe/route.js    # Stripe checkout (demo-aware)
  api/coinbase/route.js  # Coinbase Commerce (demo-aware)
  success/               # post-payment confirmation
components/
  ScrollFX.js            # scroll-progress bar + reveal observer
  Hero.js / CountUp.js   # animated hero + count-up stats
  Marquee.js             # animated tools strip
  PaymentModal.js        # multi-method checkout
  payment-tabs/          # Stripe / PayPal / Crypto / Bank tabs
  ...                    # Nav, Services, Pricing, Testimonials, FAQ, Contact, Footer
```

Built by **Ezabul Bari** — web developer & automation expert.
