import styles from './Footer.module.css';

const serviceLinks = [
  'Business automation', 'Email automation', 'Web scraping',
  'API integration', 'Social media', 'Dashboards',
];
const companyLinks = ['How it works', 'Pricing', 'Payment', 'Testimonials', 'FAQ'];

export default function Footer() {
  const year = new Date().getFullYear();

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logoWrapper}>
              <img src="/AutoFlow Brand/autoflow-mark-white.svg" alt="AutoFlow Logo" width="28" height="24" className={styles.footerLogo} />
              <div className={styles.logoText}>Auto<span>Flow</span> Solutions</div>
            </div>
            <p>Web development & automation expertise serving clients in 30+ countries. Built on trust, transparency, and results.</p>
            <div className={styles.socials}>
              <a href="#" aria-label="LinkedIn" className={styles.social}>🔗</a>
              <a href="#" aria-label="Twitter" className={styles.social}>🐦</a>
              <a href="#" aria-label="Upwork" className={styles.social}>💼</a>
            </div>
          </div>

          <div className={styles.col}>
            <h4>Services</h4>
            <ul>
              {serviceLinks.map(l => (
                <li key={l}><button onClick={() => scrollTo('services')}>{l}</button></li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4>Company</h4>
            <ul>
              {companyLinks.map(l => (
                <li key={l}>
                  <button onClick={() => scrollTo(l.toLowerCase().replace(/\s/g, '-'))}>
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:ezabul@autoflowsolutions.com">📧 Send email</a></li>
              <li><a href="#">💬 WhatsApp</a></li>
              <li><button onClick={() => scrollTo('contact')}>📅 Book a call</button></li>
              <li><a href="#">🔗 LinkedIn</a></li>
              <li><a href="#">💼 Upwork Profile</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {year} AutoFlow Solutions by Ezabul Bari. All rights reserved.</p>
          <div className={styles.badges}>
            <span className={styles.badge}>🌍 30+ Countries</span>
            <span className={styles.badge}>⚡ 150+ Workflows</span>
            <span className={styles.badge}>🔒 Secure Payments</span>
            <span className={styles.badge}>✅ Stripe Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
