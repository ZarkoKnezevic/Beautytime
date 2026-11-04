'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scroll/entrance animation driver, ported from the prototype
 * (design/site/index.html). Toggles `.in` on reveal targets via an
 * IntersectionObserver, triggers `[data-load]` on mount, and drives `.plx`
 * parallax + the gallery collage on scroll. Honors reduced motion.
 *
 * Client-navigation safe: the page is an async server component whose content
 * streams in AFTER this effect runs, so a MutationObserver registers reveal
 * targets (and re-resolves the gallery/parallax nodes) as they arrive.
 *
 * Scroll work is coalesced into one animation frame per scroll/resize event
 * and split into a read phase (layout queries) and a write phase (style
 * updates) so it never forces synchronous layout mid-frame.
 */
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const q = (s: string) => Array.from(document.querySelectorAll<HTMLElement>(s));
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const REVEAL_SEL = '.rv,.ln,.clip,.clipl,.imgw,[data-io]';
    const seen = new WeakSet<Element>();

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
    }

    // Nodes driven on scroll; re-resolved whenever the DOM changes.
    let plx: HTMLElement[] = [];
    let gal: HTMLElement | null = null;
    let galPin: HTMLElement | null = null;
    let galMain: HTMLElement | null = null;
    let galIg: HTMLElement | null = null;
    let galSides: HTMLElement[] = [];

    // Register any not-yet-tracked reveal targets, fire `[data-load]`, and
    // refresh the scroll-driven node cache.
    const scan = () => {
      q('[data-load]').forEach((el) => el.classList.add('in'));
      const els = q(REVEAL_SEL);
      if (io) {
        els.forEach((el) => {
          if (!seen.has(el)) {
            seen.add(el);
            io!.observe(el);
          }
        });
      } else {
        els.forEach((el) => el.classList.add('in'));
      }

      plx = q('.plx');
      gal = document.querySelector<HTMLElement>('.gal');
      galPin = document.querySelector<HTMLElement>('.gal-pin');
      galMain = document.querySelector<HTMLElement>('.gl-main');
      galIg = document.querySelector<HTMLElement>('.gal-ig');
      galSides = q('.gl').filter((el) => el !== galMain);
    };

    const update = () => {
      // ---- read phase ----
      const vh = window.innerHeight || 1;
      const vw = window.innerWidth || 1440;
      const mobile = vw <= 760;
      const scrolled = window.scrollY || 0;

      const plxWrites: Array<[HTMLElement, string]> = [];
      if (!reduce) {
        for (const el of plx) {
          const sp = el.dataset.speed;
          if (sp !== undefined) {
            plxWrites.push([el, `translate3d(0, ${(-scrolled * parseFloat(sp)).toFixed(1)}px, 0)`]);
            continue;
          }
          const parent = el.parentElement;
          if (!parent) continue;
          const r = parent.getBoundingClientRect();
          const p = (r.top + r.height / 2 - vh / 2) / vh;
          plxWrites.push([el, `translate3d(0, ${(p * -9).toFixed(2)}%, 0)`]);
        }
      }

      // Gallery collage: pin the stage, parallax the side photos, scale the
      // centre, reveal the "Follow us" square near the end. Flat fallback on
      // short viewports / reduced motion / tablet + mobile.
      let galState: { flat: boolean; off: number; prog: number } | null = null;
      if (gal && galPin) {
        const canScroll = document.documentElement.scrollHeight - vh > 40;
        const flat = reduce || !canScroll || vh > 1400 || vw <= 1100;
        if (flat) {
          galState = { flat, off: 0, prog: 0 };
        } else {
          const r = gal.getBoundingClientRect();
          const range = Math.max(1, r.height - vh);
          const off = Math.min(range, Math.max(0, -r.top));
          galState = { flat, off, prog: off / range };
        }
      }

      // ---- write phase ----
      for (const [el, transform] of plxWrites) el.style.transform = transform;

      if (gal && galPin && galState) {
        gal.classList.toggle('flat', galState.flat);
        if (galState.flat) {
          galPin.style.transform = '';
          galSides.forEach((el) => (el.style.transform = ''));
          if (galMain) galMain.style.transform = '';
        } else {
          const { off, prog } = galState;
          galPin.style.transform = `translateY(${off.toFixed(1)}px)`;
          galSides.forEach((el) => {
            const k = (parseFloat(el.getAttribute('data-gl') || '0.3') || 0.3) * (mobile ? 0.5 : 1);
            el.style.transform = `translateY(${((0.5 - prog) * k * 420).toFixed(1)}px)`;
          });
          if (galMain) galMain.style.transform = `scale(${(1 + prog * 0.16).toFixed(4)})`;
          galIg?.classList.toggle('on', prog > 0.72);
        }
      }
    };

    // One frame per burst of scroll/resize/mutation events.
    let frame = 0;
    const schedule = (fn: () => void) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        fn();
      });
    };
    const onScroll = () => schedule(update);
    const rescan = () => {
      scan();
      update();
    };
    const onMutation = () => schedule(rescan);

    rescan();
    // Fallback for content that streams in after this effect runs.
    const t1 = window.setTimeout(rescan, 400);

    const mo = new MutationObserver(onMutation);
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.clearTimeout(t1);
      if (frame) window.cancelAnimationFrame(frame);
      mo.disconnect();
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  return null;
}
