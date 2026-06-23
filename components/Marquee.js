import styles from './Marquee.module.css';

const TOOLS = [
  '⚡ Zapier', '🔗 Make.com', '🤖 n8n', '🧩 Airtable', '📊 Notion',
  '💳 Stripe', '🛒 Shopify', '💬 Slack', '📨 Gmail API', '🧠 OpenAI',
  '🐍 Python', '🎭 Playwright', '📈 Google Sheets', '🅿️ PayPal', '₿ Coinbase',
];

export default function Marquee() {
  // Duplicate the list so the track can loop seamlessly at -50%.
  const items = [...TOOLS, ...TOOLS];

  return (
    <div className={styles.wrap} aria-hidden="true">
      <span className={styles.label}>Built with the tools your business already trusts</span>
      <div className={styles.viewport}>
        <div className={styles.track}>
          {items.map((t, i) => (
            <span key={i} className={styles.chip}>{t}</span>
          ))}
        </div>
        <div className={styles.fadeLeft} />
        <div className={styles.fadeRight} />
      </div>
    </div>
  );
}
