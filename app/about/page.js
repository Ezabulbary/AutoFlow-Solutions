import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollFX from '@/components/ScrollFX';
import Team from '@/components/Team';
import Link from 'next/link';
import { CALENDLY_URL } from '@/lib/site';
import styles from './about.module.css';

export const metadata = {
  title: 'About | AutoFlow Solutions',
  description:
    'AutoFlow Solutions is a team of engineers, designers, and strategists building business automation for clients in 30+ countries.',
};

const values = [
  { icon: '🎯', title: 'Outcome-driven', desc: 'We measure success by the hours we save you and the growth we unlock, not lines of code.' },
  { icon: '🔍', title: 'Transparent', desc: 'Clear scope, clear pricing, recorded walkthroughs, and documentation for everything we build.' },
  { icon: '⚡', title: 'Fast & reliable', desc: 'Lean process, quick turnaround, and ongoing support so your automations keep running.' },
];

const stats = [
  { num: '150+', label: 'Workflows shipped' },
  { num: '30+', label: 'Countries served' },
  { num: '9', label: 'Team members' },
  { num: '4-8h', label: 'Avg. response time' },
];

export default function AboutPage() {
  return (
    <>
      <ScrollFX />
      <Nav />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="section-inner">
            <span className="section-eyebrow reveal">About us</span>
            <h1 className={`${styles.heroTitle} reveal`}>
              We&apos;re the team behind <span className="gradient-text">AutoFlow Solutions</span>
            </h1>
            <p className={`${styles.heroSub} reveal`}>
              We help businesses worldwide eliminate manual work with custom automation, web development,
              and data pipelines. What started as a small studio is now a full team of engineers, designers,
              and strategists serving clients in 30+ countries.
            </p>
            <div className={styles.statRow}>
              {stats.map((s) => (
                <div key={s.label} className={`${styles.stat} reveal`}>
                  <div className={styles.statNum}>{s.num}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section style={{ background: 'var(--bg-white)' }}>
          <div className="section-inner">
            <span className="section-eyebrow reveal">What we stand for</span>
            <h2 className="section-title reveal">Our values</h2>
            <div className={styles.valueGrid}>
              {values.map((v) => (
                <div key={v.title} className={`${styles.valueCard} reveal`}>
                  <div className={styles.valueIcon}>{v.icon}</div>
                  <h3 className={styles.valueTitle}>{v.title}</h3>
                  <p className={styles.valueDesc}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <Team />

        {/* CTA */}
        <section className={styles.cta}>
          <div className="section-inner" style={{ textAlign: 'center' }}>
            <h2 className={`${styles.ctaTitle} reveal`}>Ready to automate your business?</h2>
            <p className={`${styles.ctaSub} reveal`}>Book a free 30-minute discovery call with our team.</p>
            <div className={styles.ctaActions}>
              <a className="btn-primary" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                📅 Book a free call
              </a>
              <Link className="btn-secondary" href="/#pricing">View plans &amp; pricing</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
