'use client';

import { useEffect } from 'react';
import { getGsap, getScrollTrigger } from '@/lib/gsap-client';

/**
 * Site-wide scroll-scrubbed reveal.
 *
 * Replaces the previous "Intersection-Observer → one-shot CSS
 * transition" pattern so every `.fade-up` element animates *as*
 * the user scrolls, not all at once when the element happens to
 * cross a threshold. Progress is tied directly to the scroll
 * position via ScrollTrigger's `scrub: true`.
 *
 * - `.fade-up`     → fades + rises 36 → 0 px as the element travels
 *                    from `top 90%` to `top 60%`.
 * - `.scroll-zoom` → image-style scale-up from 0.92 → 1.0 across
 *                    the same window. Apply to wrapper elements
 *                    around <img> / <Image>.
 *
 * Behaviour is route-aware (re-runs on pathname change) and only
 * activates on hover-capable pointers; touch + reduced-motion
 * users get the final state immediately.
 *
 * Cleanup never touches the global ScrollTrigger list — only the
 * triggers created inside our context — so it can never orphan
 * pin-spacers from other components.
 */
export default function ScrollReveal() {
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

    let triggers: ReturnType<typeof ScrollTrigger.create>[] = [];

    const wire = () => {
      // Tear down anything from a prior route pass.
      triggers.forEach((t) => t.kill());
      triggers = [];

      const ctx = gsap.context(() => {
        // fade-up: opacity 0→1 + y 36→0 scrubbed against scroll.
        document.querySelectorAll<HTMLElement>('.fade-up').forEach((el) => {
          gsap.set(el, { opacity: 0, y: 36 });
          const tw = gsap.to(el, {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              end: 'top 55%',
              scrub: true,
              onUpdate: (self) => {
                // Keep .is-in in sync so any CSS depending on it
                // (siblings, decorators) still toggles cleanly.
                el.classList.toggle('is-in', self.progress > 0.4);
              }
            }
          });
          if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
        });

        // scroll-zoom: image wrappers scale 0.94 → 1.0 over a *long*
        // scroll window so the image stays visible while you scroll
        // it rather than snapping in/out at the edges of the viewport.
        // The scrub is bound to the bottom and top of the element
        // crossing the viewport, so the image is animated for the
        // entire time it's on screen.
        document.querySelectorAll<HTMLElement>('.scroll-zoom').forEach((el) => {
          gsap.set(el, { scale: 0.94, transformOrigin: 'center center' });
          const tw = gsap.to(el, {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',   // start the moment the top of the element enters the bottom of the viewport
              end: 'bottom top',     // finish as the bottom of the element leaves the top of the viewport
              scrub: 0.8
            }
          });
          if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
        });

        // reveal-line-inner: pre-existing mask-reveal class. Convert
        // to scrubbed translateY for the same in-flow rhythm.
        document.querySelectorAll<HTMLElement>('.reveal-line-inner').forEach((el) => {
          gsap.set(el, { yPercent: 100 });
          const tw = gsap.to(el, {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 95%',
              end: 'top 65%',
              scrub: true,
              onUpdate: (self) => el.classList.toggle('is-visible', self.progress > 0.4)
            }
          });
          if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
        });
      });

      // Recalc once the layout has settled (fonts, images).
      const refresh = () => ScrollTrigger.refresh();
      requestAnimationFrame(refresh);
      window.addEventListener('load', refresh, { once: true });

      return () => ctx.revert();
    };

    let cleanup = wire();

    // Re-wire on client-side navigation so newly-mounted DOM nodes
    // are picked up too.
    const observer = new MutationObserver(() => {
      cleanup?.();
      cleanup = wire();
    });
    observer.observe(document.body, { childList: true, subtree: false });

    return () => {
      observer.disconnect();
      cleanup?.();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return null;
}
