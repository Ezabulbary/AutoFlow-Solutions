import { sameOrigin, ok, fail, forbidden } from '@/lib/http';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

const SYSTEM = `You are Maya, a warm and helpful customer support specialist at AutoFlow Solutions,
a business automation agency (workflow automation, web development, web scraping, API integrations,
dashboards). Chat like a real person: friendly, concise (1-3 short sentences), and genuinely helpful.

Key facts you can use:
- Plans: One-time Project $200-$500, Growth Project $500-$1,500, Monthly Partner retainer $500-$1,000/mo.
- All plans include full documentation handover and post-launch support.
- Cancel anytime; if work has started a percentage is deducted for completed work, otherwise full refund.
- Free 30-minute discovery call: https://calendly.com/autoflow-solutions/30min
- The team serves clients in 30+ countries with fast turnaround.

If you cannot answer something, offer to connect them with the team or to book the free call.
Speak naturally as a member of the team ("we", "our team"). Keep replies short and human.`;

function fallbackReply(messages) {
  const last = messages.filter((m) => m.role === 'user').pop()?.content?.toLowerCase() || '';
  if (/price|pricing|cost|how much|\$/.test(last))
    return "Happy to help! Plans start at $200 for a one-time project, Growth runs $500-$1,500, and our Monthly Partner retainer is $500-$1,000/mo. Want me to suggest the best fit for you?";
  if (/call|meeting|talk|book|schedule|demo/.test(last))
    return "Of course! You can grab a free 30-minute slot here: https://calendly.com/autoflow-solutions/30min 😊";
  if (/refund|cancel/.test(last))
    return "You can cancel anytime. If we've already started, we only deduct for the work completed and refund the rest; if nothing's started, it's a full refund.";
  if (/hello|hi |hey|salam|assalam/.test(last))
    return "Hey there! 👋 Thanks for reaching out to AutoFlow. What are you looking to automate today?";
  return "Thanks for your message! Could you tell me a bit more about what you'd like to automate? I'm here to help.";
}

export async function POST(req) {
  if (!sameOrigin(req)) return forbidden('Invalid origin');

  const ip = getClientIp(req);
  const limited = rateLimit(`chat:${ip}`, { limit: 25, windowMs: 60 * 1000 });
  if (!limited.allowed) return fail('You are sending messages a little fast — give me a sec!', 429);

  let body;
  try {
    body = await req.json();
  } catch {
    return fail('Invalid request body');
  }

  const incoming = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  const messages = incoming
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return fail('No message to reply to.');
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return ok({ reply: fallbackReply(messages) });
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.CHAT_MODEL || 'claude-haiku-4-5-20251001',
        max_tokens: 320,
        system: SYSTEM,
        messages,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('chat api error:', data);
      return ok({ reply: fallbackReply(messages) });
    }
    const reply = (data.content || []).map((c) => c.text).join('').trim() || fallbackReply(messages);
    return ok({ reply });
  } catch (err) {
    console.error('chat error:', err);
    return ok({ reply: fallbackReply(messages) });
  }
}
