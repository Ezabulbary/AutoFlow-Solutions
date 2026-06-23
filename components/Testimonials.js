import styles from './Testimonials.module.css';

const testimonials = [
  {
    stars: 5,
    text: '"Ezabul automated our entire lead follow-up process. We went from spending 3 hours a day on emails to zero. The ROI was visible in week one."',
    name: 'Sarah Richardson',
    role: 'Founder, GrowthLab Agency — UK',
    initials: 'SR',
    color: '#EDE9FF',
    textColor: '#6C47FF',
  },
  {
    stars: 5,
    text: '"Our Shopify store now automatically updates inventory across 4 platforms, sends customer updates, and generates reports. Incredible work."',
    name: 'Marcus Klein',
    role: 'E-commerce Director — Germany',
    initials: 'MK',
    color: '#DFFAFA',
    textColor: '#008E8D',
  },
  {
    stars: 5,
    text: '"We hired Ezabul for a retainer and it\'s been the best investment of the year. Every month our team gets hours back that we put into actual growth."',
    name: 'Amara Lawson',
    role: 'Operations Lead, NovaSaaS — USA',
    initials: 'AL',
    color: '#FFF3DC',
    textColor: '#B36A00',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ background: 'var(--bg-white)' }}>
      <div className="section-inner">
        <span className="section-eyebrow reveal">Testimonials</span>
        <h2 className="section-title reveal">Clients love the results</h2>
        <p className="section-sub reveal">Real feedback from businesses that have automated with AutoFlow Solutions.</p>
        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <div key={i} className={`${styles.card} reveal`} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className={styles.stars}>{'★'.repeat(t.stars)}</div>
              <p className={styles.text}>{t.text}</p>
              <div className={styles.author}>
                <div
                  className={styles.avatar}
                  style={{ background: t.color, color: t.textColor }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.role}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
