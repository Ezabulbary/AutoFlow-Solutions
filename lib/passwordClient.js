// Client-safe password helpers (no secrets, usable in browser components).

const LOWER = 'abcdefghijkmnpqrstuvwxyz';
const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const DIGITS = '23456789';
const SYMBOLS = '!@#$%^&*?-_=+';

function secureRandomInt(max) {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}

/** Generate a strong, readable password meeting the server policy. */
export function generateStrongPassword(length = 16) {
  const all = LOWER + UPPER + DIGITS + SYMBOLS;
  // Guarantee one of each required class.
  const required = [
    LOWER[secureRandomInt(LOWER.length)],
    UPPER[secureRandomInt(UPPER.length)],
    DIGITS[secureRandomInt(DIGITS.length)],
    SYMBOLS[secureRandomInt(SYMBOLS.length)],
  ];
  const rest = [];
  for (let i = required.length; i < length; i++) rest.push(all[secureRandomInt(all.length)]);
  const chars = [...required, ...rest];
  // Fisher–Yates shuffle so required chars aren't always first.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

/** Score a password 0–4 and return checks + a label for a strength meter. */
export function scorePassword(password = '') {
  const checks = {
    length: password.length >= 10,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  let score = Object.values(checks).filter(Boolean).length - 1; // 0..4
  if (password.length >= 16 && score >= 4) score = 4;
  score = Math.max(0, Math.min(4, score));
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[score], checks, valid: Object.values(checks).every(Boolean) };
}
