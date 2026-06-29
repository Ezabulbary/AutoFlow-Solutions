import styles from './HowItWorks.module.css';

const steps = [
  {
    num: '01',
    icon: '🔍',
    title: 'Discovery call',
    desc: 'We spend 30 minutes mapping your current workflow, identifying bottlenecks, and defining the automation scope.',
    color: 'violet',
  },
  {
    num: '02',
    icon: '🏗️',
    title: 'Build & test',
    desc: 'We build your automation with full error handling, test it thoroughly, and iterate based on your feedback.',
    color: 'cyan',
  },
  {
    num: '03',
    icon: '🚀',
    title: 'Launch & handover',
    desc: 'Your automation goes live. We deliver a recorded walkthrough so your team understands how everything works.',
    color: 'amber',
  },
  {
    num: '04',
    icon: '🛡️',
    title: 'Support & grow',
    desc: 'Ongoing support, maintenance, and monthly retainer options to keep your automations running perfectly.',
    color: 'green',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className={styles.section}>
      <div className="section-inner">
        <span className="section-eyebrow reveal">Process</span>
        <h2 className="section-title reveal">From discovery to done, fast</h2>
        <p className="section-sub reveal">A clear four-step process so you always know what's happening and when.</p>
        <div className={styles.grid}>
          {steps.map((s, i) => (
            <div
              key={i}
              className={`${styles.card} ${styles[s.color]} reveal reveal-scale`}
              style={{ transitionDelay: `${i * 0.09}s` }}
            >
              <div className={styles.stepNum}>{s.num}</div>
              <div className={styles.icon}>{s.icon}</div>
              <h3 className={styles.title}>{s.title}</h3>
              <p className={styles.desc}>{s.desc}</p>
              {i < steps.length - 1 && <div className={styles.arrow}>→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
