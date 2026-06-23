'use client';

import { useEffect, useRef } from 'react';

/**
 * Single, non-invasive client component that powers two page-wide effects:
 *  1. A top scroll-progress bar.
 *  2. Scroll reveals for any element carrying the `reveal` class, via
 *     IntersectionObserver — so individual cards animate in without needing
 *     wrapper elements that would break CSS grid/flex layouts.
 */
export default function ScrollFX() {
  const barRef = useRef(null);

  useEffect(() => {
    // ── Scroll progress bar ──
    let ticking = false;
    const updateBar = () => {
      const el = barRef.current;
      if (el) {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
        el.style.transform = `scaleX(${Math.min(progress, 1)})`;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateBar);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    updateBar();

    // ── Scroll reveals ──
    const els = Array.from(document.querySelectorAll('.reveal'));
    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );
      els.forEach((el) => observer.observe(el));
    } else {
      els.forEach((el) => el.classList.add('is-visible'));
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
}
