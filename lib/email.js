// Minimal email sender. Uses Resend (https://resend.com) when RESEND_API_KEY
// is set — a plain HTTPS call, no extra dependency. Without a key (local/dev),
// it logs the message to the server console so you can still test the flow.
export async function sendEmail({ to, subject, html, text }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'AutoFlow Solutions <onboarding@resend.dev>';

  if (!key) {
    console.log(
      `\n──────── [email:dev] (no RESEND_API_KEY — not actually sent) ────────\n` +
        `To: ${to}\nSubject: ${subject}\n\n${text || html}\n` +
        `────────────────────────────────────────────────────────────────────\n`
    );
    return { delivered: false, dev: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, html, text }),
    });
    if (!res.ok) {
      console.error('Email send failed:', res.status, await res.text());
      return { delivered: false };
    }
    return { delivered: true };
  } catch (err) {
    console.error('Email send error:', err);
    return { delivered: false };
  }
}

export function resetPasswordEmail({ name, url }) {
  const subject = 'Reset your AutoFlow Solutions password';
  const text =
    `Hi ${name || 'there'},\n\n` +
    `We received a request to reset your password. Open the link below to choose a new one. ` +
    `It expires in 1 hour.\n\n${url}\n\n` +
    `If you didn't request this, you can safely ignore this email.`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px">
      <h2 style="color:#5b21b6">Reset your password</h2>
      <p>Hi ${name || 'there'}, we received a request to reset your AutoFlow Solutions password.</p>
      <p><a href="${url}" style="display:inline-block;background:#6d28d9;color:#fff;padding:12px 22px;border-radius:50px;text-decoration:none;font-weight:600">Choose a new password</a></p>
      <p style="color:#666;font-size:13px">This link expires in 1 hour. If you didn't request it, ignore this email.</p>
      <p style="color:#999;font-size:12px;word-break:break-all">${url}</p>
    </div>`;
  return { subject, text, html };
}
