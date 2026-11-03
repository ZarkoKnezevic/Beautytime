'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scroll/entrance animation driver, ported 1:1 from the prototype
 * (design/site/index.html). Toggles `.in` on reveal targets via an
 * IntersectionObserver, triggers `[data-load]` on mount, and drives `.plx`
 * parallax on scroll. Re-runs on client navigation. Honors reduced motion.
 */
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const q = (s: string) => Array.from(document.querySelectorAll<HTMLElement>(s));
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const loadTimer = window.setTimeout(
      () => q('[data-load]').forEach((el) => el.classList.add('in')),
      120
    );

    const els = q('.rv,.ln,.clip,.clipl,.imgw,[data-io]');
    let io: IntersectionObserver | null = null;

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
      );
      els.forEach((el) => io?.observe(el));
    } else {
      els.forEach((el) => el.classList.add('in'));
    }

    const plx = q('.plx');
    const gal = document.querySelector<HTMLElement>('.gal');
    const galPin = document.querySelector<HTMLElement>('.gal-pin');
    const galMain = document.querySelector<HTMLElement>('.gl-main');
    const galIg = document.querySelector<HTMLElement>('.gal-ig');
    const galGl = q('.gl');

    const onScroll = () => {
      const vh = window.innerHeight || 1;
      const mobile = (window.innerWidth || 1440) <= 760;

      if (!reduce) {
        const scrolled = window.scrollY || window.pageYOffset || 0;
        plx.forEach((el) => {
          const sp = el.dataset.speed;
          if (sp !== undefined) {
            el.style.transform = `translate3d(0, ${(-scrolled * parseFloat(sp)).toFixed(1)}px, 0)`;
            return;
          }
          const parent = el.parentElement;
          if (!parent) return;
          const r = parent.getBoundingClientRect();
          const p = (r.top + r.height / 2 - vh / 2) / vh;
          el.style.transform = `translate3d(0, ${(p * -9).toFixed(2)}%, 0)`;
        });
      }

      // Gallery collage: pin the stage, parallax the side photos, scale the
      // centre, reveal the "Follow us" square near the end. Flat fallback on
      // short viewports / reduced motion.
      if (gal && galPin) {
        const canScroll = document.documentElement.scrollHeight - vh > 40;
        const flat = reduce || !canScroll || vh > 1400;
        gal.classList.toggle('flat', flat);
        if (flat) {
          galPin.style.transform = '';
          galGl.forEach((el) => {
            if (el !== galMain) el.style.transform = '';
          });
          if (galMain) galMain.style.transform = '';
        } else {
          const r = gal.getBoundingClientRect();
          const range = Math.max(1, r.height - vh);
          const off = Math.min(range, Math.max(0, -r.top));
          galPin.style.transform = `translateY(${off.toFixed(1)}px)`;
          const prog = off / range;
          galGl.forEach((el) => {
            if (el === galMain) return;
            const k = (parseFloat(el.getAttribute('data-gl') || '0.3') || 0.3) * (mobile ? 0.5 : 1);
            el.style.transform = `translateY(${((0.5 - prog) * k * 420).toFixed(1)}px)`;
          });
          if (galMain) galMain.style.transform = `scale(${(1 + prog * 0.16).toFixed(4)})`;
          galIg?.classList.toggle('on', prog > 0.72);
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    return () => {
      window.clearTimeout(loadTimer);
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  return null;
}
