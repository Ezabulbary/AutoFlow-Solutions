# AutoFlow Solutions — Setup & Troubleshooting Guide

A single reference for every step that has caused an error, with the exact fix.

---

## 0. Golden rules (এই ৩টা মনে রাখো)

1. **Env বদলালে সবসময় restart করো** — `Ctrl + C` তারপর `npm run dev`. Next.js
   পুরোনো env cache করে রাখে।
2. **ফাইল replace মানে একই নাম + একই path-এ overwrite** — নতুন নামে ফাইল যোগ
   করলে Next.js সেটা চেনে না (নিচে "route.js" দেখো)।
3. **Cache সমস্যা হলে** `.next` ফোল্ডার মুছে আবার চালাও:
   `rmdir /s /q .next`  (PowerShell: `Remove-Item -Recurse -Force .next`)

---

## 1. Required environment (`.env.local`)

প্রজেক্ট root-এ `.env.local` ফাইল (`.env.example` কপি করে)। কমপক্ষে:

```bash
MONGODB_URI=...                 # MongoDB Atlas connection string (নিচে দেখো)
SESSION_SECRET=...              # min 32 random characters
SUPER_ADMIN_EMAIL=tomar@gmail.com   # এই email দিয়ে register/Google = admin

# Google login (ঐচ্ছিক)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Password-reset email (ঐচ্ছিক)
RESEND_API_KEY=
EMAIL_FROM=AutoFlow Solutions <onboarding@resend.dev>
```

---

## 2. MongoDB — `querySrv ECONNREFUSED` (register fail / "Could not create account")

**কারণ:** তোমার নেটওয়ার্ক `mongodb+srv://`-এর DNS SRV lookup block করে।

**সমাধান (যেকোনো একটা):**
- **A —** Atlas → Connect → Drivers → "Driver version" = **Node.js 2.2.12 or later**
  → এতে `mongodb://...` (SRV ছাড়া, ৩টা host) string পাবে → সেটা `MONGODB_URI`-তে বসাও।
- **B —** Windows DNS পাল্টে Google DNS দাও: `ncpa.cpl` → adapter → Properties →
  IPv4 → DNS = `8.8.8.8` / `8.8.4.4` → restart.
- **মনে রাখো:** db নাম যোগ করো → `...mongodb.net/autoflow?...`; password-এ special
  character (`@ # / :`) এড়াও; Atlas → Network Access-এ `0.0.0.0/0` দাও।

> Deploy (Vercel) করলে এই DNS সমস্যা থাকে না — সেখানে `mongodb+srv://` কাজ করে।

---

## 3. Turbopack crash — "Next.js package not found" (বারবার)

**কারণ:** Next 16-এর Turbopack Windows-এ, বিশেষত path-এ space থাকলে, crash করে।

**সমাধান:** `package.json`-এ dev script এখন Webpack ব্যবহার করে:
```json
"dev": "next dev --webpack"
```
`Ctrl+C` → `rmdir /s /q .next` → `npm run dev`. (Turbopack চাইলে `npm run dev:turbo`.)

> চাইলে project টা space ছাড়া path-এ রাখো, যেমন `C:\dev\autoflow`.

---

## 4. Hydration warning + bottom-left "1 Issue" badge

**কারণ:** Grammarly-জাতীয় browser extension `<body>`-তে attribute বসায়।
**এটা dev-only — deploy করলে কোনো visitor দেখবে না।** `app/layout.js`-এ
`<body suppressHydrationWarning>` দিয়ে এটা চাপা দেওয়া আছে। নিরাপদ, ignore করা যায়।

---

## 5. Google login

### 5a. `Error 400: redirect_uri_mismatch`
App যে callback URL পাঠায়, Google Console-এ সেটা হুবহু থাকতে হবে।
1. Google Cloud Console → APIs & Services → Credentials → তোমার OAuth client।
2. **Authorized redirect URIs** → যোগ করো (হুবহু):
   `http://localhost:3000/api/auth/google/callback`
   (port তোমার dev port-এর সাথে মিলবে; deploy-এ `https://your-site/api/auth/google/callback`)
3. **Authorized JavaScript origins** → `http://localhost:3000`
4. Save → ১-২ মিনিট অপেক্ষা → retry।
> কোড এখন সবসময় current host ব্যবহার করে, তাই localhost-এ localhost callback যায়।

### 5b. "Google sign-in failed" — কোন ধাপে তা দেখো
Login পেজে এখন নির্দিষ্ট কারণ + URL-এ `?reason=...` দেখায়:
- **`reason=token`** → `GOOGLE_CLIENT_SECRET`/`CLIENT_ID` ভুল বা redirect URI mismatch।
  `.env.local` মিলাও, restart করো।
- **`reason=state`** → security cookie block/expire। একই browser tab-এ retry; cookie
  blocker বন্ধ করো।
- **`reason=db`** → Google ঠিক, কিন্তু account save fail। এখন পেজে `(detail: ...)`
  আকারে আসল error দেখাবে — সেটাই কারণ (সাধারণত MongoDB connection/SESSION_SECRET)।

### 5c. ⚠️ "ফাইল replace করলাম তবু same error"
`callback-route.js` নামে **নতুন ফাইল যোগ করলে কাজ হবে না**। ফাইলটা অবশ্যই
`app/api/auth/google/callback/route.js` নামেই (পুরোনোটা overwrite) বসবে।

---

## 6. Forgot password — "email sent" দেখায় কিন্তু email আসে না

**এটা bug না।** `RESEND_API_KEY` সেট না থাকলে আসল email যায় না — reset **link টা
`npm run dev` চালানো terminal-এ print হয়**:
```
──── [email:dev] (no RESEND_API_KEY — not actually sent) ────
http://localhost:3000/reset-password?token=...
```
ওই link খুলে নতুন password দাও।

**আসল email পাঠাতে:** [resend.com](https://resend.com) → free API key →
`.env.local`-এ `RESEND_API_KEY=re_...` → restart।

---

## 7. Deploy to Vercel (live করা)

1. কোড GitHub-এ push করো।
2. https://vercel.com/new → repo import।
3. Environment Variables-এ `.env.local`-এর সব value বসাও +
   `NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app`.
4. Deploy। তারপর Google Console-এ production redirect URI যোগ করো।

---

## 8. দ্রুত checklist

| লক্ষণ | দেখো |
|---|---|
| register fail | §2 MongoDB / terminal-এ `querySrv` |
| dev crash বারবার | §3 Webpack + `.next` মুছো |
| নিচে লাল "1 Issue" | §4 নিরাপদ, dev-only |
| Google 400 mismatch | §5a redirect URI |
| Google "failed" | §5b `reason=` দেখো |
| reset email নেই | §6 terminal-এ link |
| env বদলেও কাজ হয় না | §0 restart |
