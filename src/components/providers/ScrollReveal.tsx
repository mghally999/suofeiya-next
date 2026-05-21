'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getGsap, getScrollTrigger } from '@/lib/gsap-client';

/**
 * Site-wide scroll-tied reveal.
 *
 * Tuning history:
 *   - Original used `scrub: true` + a MutationObserver. The observer
 *     re-wired on every class toggle (hover, focus), re-snapping
 *     elements mid-scroll → "vibration".
 *   - Pass 2 added `scrub: 0.8` smoothing. That fixed the vibration
 *     but introduced a 0.8 s catch-up lag → elements visibly
 *     "appeared after I stop scrolling" — the exact opposite of
 *     what the user wants.
 *
 * Pass 3 (this version):
 *   - `scrub: true` again, BUT no MutationObserver anymore (re-wire
 *     happens only on route change via `usePathname()`). The
 *     vibration source from pass 1 is gone, so we can take the
 *     instant 1:1 response.
 *   - Reveal window widened to start at `top bottom` and finish at
 *     `top 50%` so the animation runs across the full bottom half
 *     of the viewport rather than a tight 30 % strip — gives every
 *     pixel of scroll a visible reveal increment.
 *   - Per-element `data-reveal-wired="1"` flag still prevents
 *     duplicate wires on the same node.
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

      // .fade-up — opacity + y rise scrubbed 1:1 with scroll.
      // The reveal runs from the moment the element top enters the
      // bottom of the viewport to when it reaches the centre. That's
      // 50 % of viewport pixels of animation distance — enough to
      // feel like a continuous reveal, instant enough not to lag.
      wire(
        '.fade-up',
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, ease: 'none' },
        { start: 'top bottom', end: 'top 50%', scrub: true }
      );

      // .scroll-zoom — image scale across the full visible lifetime.
      wire(
        '.scroll-zoom',
        { scale: 0.96, transformOrigin: 'center center' },
        { scale: 1, ease: 'none' },
        { start: 'top bottom', end: 'bottom top', scrub: true }
      );

      // .reveal-line-inner — mask reveal scrubbed 1:1.
      wire(
        '.reveal-line-inner',
        { yPercent: 100 },
        { yPercent: 0, ease: 'none' },
        { start: 'top bottom', end: 'top 55%', scrub: true }
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
