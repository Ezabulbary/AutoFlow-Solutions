'use client';

import { useState, useEffect } from 'react';
import styles from './Team.module.css';

// Demo team. Swap names/photos/bios with your real team anytime.
const team = [
  {
    name: 'Rafiul Hasan', role: 'Founder & CEO', region: 'Dhaka, Bangladesh',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Rafiul founded AutoFlow Solutions to make automation accessible to every business. He sets the vision and works closely with clients on high-impact projects.',
    skills: ['Strategy', 'Automation', 'Client partnerships'],
  },
  {
    name: 'Tanvir Ahmed', role: 'Chief Technology Officer', region: 'Dhaka, Bangladesh',
    img: 'https://randomuser.me/api/portraits/men/45.jpg',
    bio: 'Tanvir leads engineering and architecture, making sure every automation we ship is reliable, secure, and built to scale.',
    skills: ['System design', 'Security', 'APIs'],
  },
  {
    name: 'Sakib Rahman', role: 'Lead Automation Engineer', region: 'Chattogram, Bangladesh',
    img: 'https://randomuser.me/api/portraits/men/22.jpg',
    bio: 'Sakib designs and builds complex multi-step workflows across Zapier, Make, and n8n that eliminate hours of manual work.',
    skills: ['Zapier', 'Make.com', 'n8n'],
  },
  {
    name: 'Nahid Islam', role: 'Senior Full-Stack Developer', region: 'Sylhet, Bangladesh',
    img: 'https://randomuser.me/api/portraits/men/76.jpg',
    bio: 'Nahid builds custom dashboards, integrations, and web apps that connect the tools our clients already use.',
    skills: ['Next.js', 'Node.js', 'Integrations'],
  },
  {
    name: 'Daniel Carter', role: 'Solutions Architect', region: 'London, UK',
    img: 'https://randomuser.me/api/portraits/men/64.jpg',
    bio: 'Daniel translates business goals into automation blueprints, scoping projects so delivery is fast and predictable.',
    skills: ['Solution design', 'Discovery', 'Scoping'],
  },
  {
    name: 'Arif Mahmud', role: 'DevOps Engineer', region: 'Dhaka, Bangladesh',
    img: 'https://randomuser.me/api/portraits/men/53.jpg',
    bio: 'Arif keeps everything running smoothly with monitoring, alerts, and rock-solid deployment pipelines.',
    skills: ['CI/CD', 'Monitoring', 'Cloud'],
  },
  {
    name: 'James Okafor', role: 'Data Engineer', region: 'Toronto, Canada',
    img: 'https://randomuser.me/api/portraits/men/41.jpg',
    bio: 'James builds the data pipelines and scrapers that turn messy sources into clean, structured information.',
    skills: ['Python', 'Pipelines', 'Web scraping'],
  },
  {
    name: 'Nusrat Jahan', role: 'Head of Design (UI/UX)', region: 'Dhaka, Bangladesh',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Nusrat leads product and brand design, making every dashboard and interface we deliver clear and delightful to use.',
    skills: ['UI/UX', 'Figma', 'Branding'],
  },
  {
    name: 'Farzana Akter', role: 'Project Manager', region: 'Dhaka, Bangladesh',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
    bio: 'Farzana keeps projects on track, coordinating the team and clients so deadlines are always met.',
    skills: ['Delivery', 'Coordination', 'Agile'],
  },
  {
    name: 'Sadia Islam', role: 'Client Success Manager', region: 'Khulna, Bangladesh',
    img: 'https://randomuser.me/api/portraits/women/65.jpg',
    bio: 'Sadia is the friendly point of contact after launch, making sure every client gets the most from their automations.',
    skills: ['Support', 'Onboarding', 'Training'],
  },
  {
    name: 'Maliha Chowdhury', role: 'Marketing Lead', region: 'Dhaka, Bangladesh',
    img: 'https://randomuser.me/api/portraits/women/12.jpg',
    bio: 'Maliha tells the AutoFlow story and helps businesses discover how automation can transform their operations.',
    skills: ['Growth', 'Content', 'Brand'],
  },
  {
    name: 'Emily Roberts', role: 'Content Strategist', region: 'Sydney, Australia',
    img: 'https://randomuser.me/api/portraits/women/30.jpg',
    bio: 'Emily creates the documentation, guides, and walkthroughs that make our automations easy for any team to run.',
    skills: ['Docs', 'Strategy', 'Education'],
  },
];

export default function Team() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => { if (e.key === 'Escape') setActive(null); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active]);

  return (
    <section id="team" className={styles.section}>
      <div className="section-inner">
        <span className="section-eyebrow reveal">Our people</span>
        <h2 className="section-title reveal" style={{ textAlign: 'center' }}>Meet our team</h2>
        <p className="section-sub reveal" style={{ textAlign: 'center' }}>
          A multidisciplinary team of engineers, designers, and strategists. Tap any member to learn more.
        </p>
        <div className={styles.grid}>
          {team.map((m) => (
            <button key={m.name} type="button" className={`${styles.card} reveal`} onClick={() => setActive(m)}>
              <div className={styles.photoWrap}>
                <img className={styles.photo} src={m.img} alt={m.name} width="120" height="120" loading="lazy" />
              </div>
              <h3 className={styles.name}>{m.name}</h3>
              <p className={styles.role}>{m.role}</p>
              <span className={styles.region}>📍 {m.region}</span>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setActive(null)}>
          <div className={styles.modal}>
            <button type="button" className={styles.close} onClick={() => setActive(null)} aria-label="Close">✕</button>
            <div className={styles.modalPhotoWrap}>
              <img className={styles.modalPhoto} src={active.img} alt={active.name} width="140" height="140" />
            </div>
            <h3 className={styles.modalName}>{active.name}</h3>
            <p className={styles.modalRole}>{active.role}</p>
            <span className={styles.region}>📍 {active.region}</span>
            <p className={styles.modalBio}>{active.bio}</p>
            <div className={styles.skills}>
              {active.skills.map((s) => (
                <span key={s} className={styles.skill}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
