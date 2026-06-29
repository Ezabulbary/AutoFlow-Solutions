import styles from './Marquee.module.css';

const ROW_ONE = [
  '⚡ Zapier', '🔗 Make.com', '🤖 n8n', '🧩 Airtable', '📊 Notion',
  '💳 Stripe', '🛒 Shopify', '💬 Slack',
];
const ROW_TWO = [
  '🧠 OpenAI', '📨 Gmail API', '🐍 Python', '🎭 Playwright',
  '📈 Google Sheets', '🅿️ PayPal', '₿ Coinbase', '🔵 HubSpot',
];

function Row({ items, reverse }) {
  // Duplicate so the track can loop seamlessly at -50%.
  const doubled = [...items, ...items];
  return (
    <div className={styles.viewport}>
      <div className={`${styles.track} ${reverse ? styles.reverse : ''}`}>
        {doubled.map((t, i) => (
          <span key={i} className={styles.chip}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <span className={styles.label}>Built with the tools your business already trusts</span>
      <div className={styles.rows}>
        <Row items={ROW_ONE} />
        <Row items={ROW_TWO} reverse />
      </div>
      <div className={styles.fadeLeft} />
      <div className={styles.fadeRight} />
    </div>
  );
}
