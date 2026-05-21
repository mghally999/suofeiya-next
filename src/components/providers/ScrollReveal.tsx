'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getGsap, getScrollTrigger } from '@/lib/gsap-client';

/**
 * Site-wide scroll-tied reveal.
 *
 * Previous version vibrated because:
 *   - `scrub: true` snapped 1:1 to scroll, so any trackpad / lenis
 *     jitter shook the animation.
 *   - A MutationObserver on `document.body` re-wired every
 *     ScrollTrigger on every DOM mutation (hover state toggles
 *     React's class list, etc.) — every wire-up re-snapped elements
 *     to their `prep` state mid-scroll, looking like a flash.
 *
 * This version:
 *   - Uses `scrub: <number>` (smoothing factor) so the tween catches
 *     up to scroll over a fraction of a second instead of locking
 *     1:1. Visually identical, jitter-immune.
 *   - Re-wires ONLY on `usePathname()` change — route navigation,
 *     not arbitrary DOM mutations.
 *   - Marks elements `data-reveal-wired="1"` so a re-run never
 *     touches one that's already animated.
 *   - Refreshes ScrollTrigger once after fonts + images settle.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      document.querySelectorAll<HTMLElement>('.fade-up, .scroll-zoom, .reveal-line-inner').forEach((el) => {
        el.classList.add('is-in', 'is-visible');
      });
      return;
    }

    const gsap = getGsap();
    const ScrollTrigger = getScrollTrigger();

    const ctx = gsap.context(() => {
      const wire = (
        selector: string,
        prep: gsap.TweenVars,
        anim: gsap.TweenVars,
        trigger: globalThis.ScrollTrigger.Vars
      ) => {
        document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
          if (el.dataset.revealWired === '1') return; // never re-wire
          el.dataset.revealWired = '1';
          gsap.set(el, prep);
          gsap.to(el, { ...anim, scrollTrigger: { ...trigger, trigger: el } });
        });
      };

      // .fade-up — opacity + y rise scrubbed with smoothing.
      wire(
        '.fade-up',
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, ease: 'none' },
        { start: 'top 90%', end: 'top 60%', scrub: 0.8 }
      );

      // .scroll-zoom — image scale across the full visible lifetime.
      wire(
        '.scroll-zoom',
        { scale: 0.96, transformOrigin: 'center center' },
        { scale: 1, ease: 'none' },
        { start: 'top bottom', end: 'bottom top', scrub: 1 }
      );

      // .reveal-line-inner — mask reveal scrubbed.
      wire(
        '.reveal-line-inner',
        { yPercent: 100 },
        { yPercent: 0, ease: 'none' },
        { start: 'top 95%', end: 'top 65%', scrub: 0.8 }
      );
    });

    // Refresh once layout has settled (fonts + lazy images).
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    window.addEventListener('load', refresh, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
      ctx.revert();
      // Drop the wired flag so the next pathname-driven pass re-runs
      // cleanly on freshly-mounted DOM.
      document
        .querySelectorAll<HTMLElement>('[data-reveal-wired="1"]')
        .forEach((el) => delete el.dataset.revealWired);
    };
  }, [pathname]);

  return null;
}
