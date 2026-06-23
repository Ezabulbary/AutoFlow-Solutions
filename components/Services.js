import styles from './Services.module.css';

const services = [
  {
    badge: 'Most popular',
    title: 'Business process automation',
    desc: 'Automate invoicing, CRM updates, lead routing, email follow-ups, and data entry. Free your team from repetitive work.',
    tools: ['Zapier', 'Make.com', 'n8n', 'Airtable'],
    accent: '#6C47FF',
    light: '#EDE9FF',
  },
  {
    badge: 'High ROI',
    title: 'Email & outreach automation',
    desc: 'Cold email sequences, follow-up flows, inbox management, and smart reply detection for sales-driven businesses.',
    tools: ['Apollo', 'Instantly', 'Lemlist', 'Gmail API'],
    accent: '#00C9C8',
    light: '#DFFAFA',
  },
  {
    badge: 'Data',
    title: 'Web scraping & data pipelines',
    desc: 'Extract, clean, and deliver structured data from any website — leads, prices, research, or competitor intelligence.',
    tools: ['Python', 'Playwright', 'BeautifulSoup', 'Sheets'],
    accent: '#FF9900',
    light: '#FFF3DC',
  },
  {
    badge: 'Integration',
    title: 'API & webhook integration',
    desc: 'Connect apps that don\'t talk to each other. Custom API integrations for Shopify, Notion, Slack, Stripe, and more.',
    tools: ['REST APIs', 'Webhooks', 'Shopify', 'Stripe'],
    accent: '#FF4D6D',
    light: '#FFE8ED',
  },
  {
    badge: 'Social',
    title: 'Social media automation',
    desc: 'Schedule posts, auto-reply to DMs, collect analytics, generate AI captions, and grow audiences on autopilot.',
    tools: ['Buffer', 'Phantombuster', 'OpenAI API', 'Meta API'],
    accent: '#22C55E',
    light: '#DCFCE7',
  },
  {
    badge: 'Reporting',
    title: 'Auto-generated dashboards',
    desc: 'Weekly and monthly reports delivered automatically to inboxes or Notion — no manual compiling ever again.',
    tools: ['Google Sheets', 'Looker', 'Notion', 'Slack'],
    accent: '#8B5CF6',
    light: '#F3E8FF',
  },
];

export default function Services() {
  return (
    <section id="services">
      <div className="section-inner">
        <span className="section-eyebrow">Services</span>
        <h2 className="section-title">What I automate for you</h2>
        <p className="section-sub">Six core automation services designed to eliminate your most time-consuming tasks.</p>
        <div className={styles.grid}>
          {services.map((svc, i) => (
            <div
              key={i}
              className={styles.card}
              style={{ '--accent': svc.accent, '--light': svc.light }}
            >
              <div className={styles.topBar} style={{ background: svc.accent }} />
              <span className={styles.badge} style={{ background: svc.light, color: svc.accent }}>
                {svc.badge}
              </span>
              <h3 className={styles.title}>{svc.title}</h3>
              <p className={styles.desc}>{svc.desc}</p>
              <div className={styles.tools}>
                {svc.tools.map(t => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
