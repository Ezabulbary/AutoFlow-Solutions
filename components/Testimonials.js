import styles from './Testimonials.module.css';

// 32 short reviews. m/f + index pick a matching randomuser portrait.
const R = (g, i) => `https://randomuser.me/api/portraits/${g === 'f' ? 'women' : 'men'}/${i}.jpg`;

const reviews = [
  { t: 'Automated our entire lead follow-up. From 3 hours a day to zero.', n: 'Sarah Richardson', r: 'Founder, GrowthLab, UK', g: 'f', i: 11 },
  { t: 'Our Shopify store now syncs inventory across 4 platforms automatically.', n: 'Marcus Klein', r: 'E-commerce Director, Germany', g: 'm', i: 12 },
  { t: 'Best investment of the year. Every month our team gets hours back.', n: 'Amara Lawson', r: 'Operations Lead, USA', g: 'f', i: 13 },
  { t: 'They built a scraper that feeds our CRM in real time. Flawless.', n: 'David Chen', r: 'Sales Manager, Singapore', g: 'm', i: 14 },
  { t: 'Clear scope, fast delivery, and documentation for everything.', n: 'Priya Nair', r: 'COO, India', g: 'f', i: 15 },
  { t: 'Our reporting that took a full day now lands in Slack every morning.', n: 'Tom Wallace', r: 'Analyst, Australia', g: 'm', i: 16 },
  { t: 'The onboarding automation cut our manual work by 80%.', n: 'Elena Rossi', r: 'HR Lead, Italy', g: 'f', i: 17 },
  { t: 'Responsive, professional, and the workflows just work.', n: 'Kwame Mensah', r: 'Founder, Ghana', g: 'm', i: 18 },
  { t: 'They connected tools we thought could never talk to each other.', n: 'Hana Suzuki', r: 'Product Manager, Japan', g: 'f', i: 19 },
  { t: 'ROI was visible within the first week. Highly recommend.', n: 'Lucas Moreau', r: 'CEO, France', g: 'm', i: 20 },
  { t: 'Customer updates now go out automatically. Zero missed messages.', n: 'Olivia Bennett', r: 'Support Lead, Canada', g: 'f', i: 21 },
  { t: 'A dashboard that finally gives us one source of truth.', n: 'Diego Alvarez', r: 'Director, Mexico', g: 'm', i: 22 },
  { t: 'Smooth retainer relationship. They feel like part of our team.', n: 'Mariam Haddad', r: 'Founder, UAE', g: 'f', i: 23 },
  { t: 'Our invoicing is fully automated now. Game changer.', n: 'Henrik Olsen', r: 'Finance Lead, Norway', g: 'm', i: 24 },
  { t: 'They scoped, built, and handed over in under two weeks.', n: 'Grace Thompson', r: 'Marketing Lead, UK', g: 'f', i: 25 },
  { t: 'The crypto + card checkout they set up just works globally.', n: 'Ahmed Farouk', r: 'Founder, Egypt', g: 'm', i: 26 },
  { t: 'Social posting and analytics on autopilot. Love it.', n: 'Sofia Castro', r: 'Creator, Brazil', g: 'f', i: 27 },
  { t: 'Error alerts mean we catch issues before customers do.', n: 'Liam Murphy', r: 'CTO, Ireland', g: 'm', i: 28 },
  { t: 'Documentation so good our whole team can manage it.', n: 'Yuki Tanaka', r: 'Ops, Japan', g: 'f', i: 29 },
  { t: 'They turned a messy spreadsheet process into a clean pipeline.', n: 'Robert King', r: 'Owner, USA', g: 'm', i: 30 },
  { t: 'Fast, friendly, and genuinely knowledgeable. Five stars.', n: 'Aisha Bello', r: 'Founder, Nigeria', g: 'f', i: 31 },
  { t: 'We scaled to 3x order volume without hiring. Automation did it.', n: 'Daniel Schmidt', r: 'Ops Director, Austria', g: 'm', i: 32 },
  { t: 'The monthly retainer keeps improving things we did not even ask for.', n: 'Chloe Dubois', r: 'CMO, France', g: 'f', i: 33 },
  { t: 'Clean code, clear handover, and great support after launch.', n: 'Mohammed Ali', r: 'Engineer, Qatar', g: 'm', i: 34 },
  { t: 'Our appointment booking runs itself now. No more no-shows.', n: 'Isabella Ferrari', r: 'Clinic Owner, Italy', g: 'f', i: 35 },
  { t: 'They integrated 6 tools into one smooth workflow.', n: 'Nathan Cole', r: 'Founder, USA', g: 'm', i: 36 },
  { t: 'Communication was excellent throughout the whole project.', n: 'Fatima Zahra', r: 'Manager, Morocco', g: 'f', i: 37 },
  { t: 'The automation paid for itself in the first month.', n: 'Sergio Romero', r: 'CEO, Spain', g: 'm', i: 38 },
  { t: 'Reliable, transparent, and a pleasure to work with.', n: 'Emma Wilson', r: 'Director, Australia', g: 'f', i: 39 },
  { t: 'They handle our data pipelines so we can focus on growth.', n: 'Victor Petrov', r: 'Founder, Estonia', g: 'm', i: 40 },
  { t: 'Brilliant team. Our workflows have never been more stable.', n: 'Leila Karimi', r: 'COO, Iran', g: 'f', i: 41 },
  { t: 'From discovery to launch, the whole process was effortless.', n: 'Andrew Scott', r: 'Owner, Canada', g: 'm', i: 42 },
];

function Card({ rev }) {
  return (
    <div className={styles.card}>
      <div className={styles.stars}>{'★★★★★'}</div>
      <p className={styles.text}>&ldquo;{rev.t}&rdquo;</p>
      <div className={styles.author}>
        <img className={styles.avatar} src={R(rev.g, rev.i)} alt={rev.n} width="44" height="44" loading="lazy" />
        <div>
          <div className={styles.name}>{rev.n}</div>
          <div className={styles.role}>{rev.r}</div>
        </div>
      </div>
    </div>
  );
}

function Row({ items, reverse }) {
  const doubled = [...items, ...items];
  return (
    <div className={styles.viewport}>
      <div className={`${styles.track} ${reverse ? styles.reverse : ''}`}>
        {doubled.map((rev, i) => <Card key={i} rev={rev} />)}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const half = Math.ceil(reviews.length / 2);
  return (
    <section id="testimonials" className={styles.section}>
      <div className="section-inner">
        <span className="section-eyebrow reveal">Testimonials</span>
        <h2 className="section-title reveal" style={{ textAlign: 'center' }}>Loved by 30+ businesses worldwide</h2>
        <p className="section-sub reveal" style={{ textAlign: 'center' }}>
          Real feedback from teams that have automated with AutoFlow Solutions.
        </p>
      </div>
      <div className={styles.rows} aria-hidden="true">
        <Row items={reviews.slice(0, half)} />
        <Row items={reviews.slice(half)} reverse />
      </div>
    </section>
  );
}
