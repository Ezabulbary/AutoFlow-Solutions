'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Nav.module.css';
import { useAuth } from './AuthProvider';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function go(link) {
    setMenuOpen(false);
    if (link.route) {
      router.push(link.route);
      return;
    }
    const el = document.getElementById(link.id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.location.href = `/#${link.id}`; // section lives on the landing page
  }

  const links = [
    { id: 'how', label: 'How it works' },
    { id: 'services', label: 'Services' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'about', label: 'About', route: '/about' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <a href="#" className={styles.logo} onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className={styles.logoIcon}>
            <img src="/AutoFlow Brand/autoflow-mark-white.svg" alt="AutoFlow Logo" width="20" height="20" />
          </div>
          <span className={styles.logoText}>Auto<span>Flow</span></span>
        </a>

        <ul className={styles.links}>
          {links.map(l => (
            <li key={l.id}>
              <button type="button" className={styles.link} onClick={() => go(l)}>
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.navRight}>
          {!loading && user ? (
            <button type="button" className={styles.dashBtn} onClick={() => router.push('/dashboard')}>
              <span className={styles.navAvatar}>
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </span>
              Dashboard
            </button>
          ) : (
            <>
              <button type="button" className={styles.loginLink} onClick={() => router.push('/login')}>
                Log in
              </button>
              <button type="button" className={styles.cta} onClick={() => router.push('/register')}>
                Get started
              </button>
            </>
          )}
          <button
            type="button"
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerInner}>
          {links.map(l => (
            <button type="button" key={l.id} className={styles.drawerLink} onClick={() => go(l)}>
              {l.label}
            </button>
          ))}
          <button type="button" className={styles.drawerCta} onClick={() => go({ id: 'pricing' })}>
            🚀 Get started
          </button>
        </div>
      </div>
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}
    </>
  );
}
