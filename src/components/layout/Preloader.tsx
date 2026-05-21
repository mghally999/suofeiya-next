'use client';

import { useEffect, useState } from 'react';

/**
 * Preloader echoes the header logo exactly — cream SU + burgundy
 * isometric cube + cream FEIYA. The cube polygons are a literal
 * copy of `Cube` in `src/components/layout/Logo.tsx`, so the brand
 * mark stays identical at every render size.
 *
 * IMPORTANT — gated behind sessionStorage. The preloader is in the
 * root layout, so on every client-side Link navigation the layout
 * (and this component) remounts and the timer restarts. That was
 * covering the hero of every project-detail page with a charcoal
 * sheet for 1.4 seconds — making the hero look "broken" until the
 * user scrolled past it. We now show the preloader ONCE per browser
 * session and skip it entirely on subsequent navigations.
 *
 * Mobile-tuned: the timeout is 700 ms on touch viewports (vs. 900 ms
 * on desktop) so phones get to the hero faster.
 */
const SESSION_KEY = '__sf_preloader_shown';

export default function Preloader() {
  const [hidden, setHidden] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (hidden) return;
    const isTouch =
      typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const t = setTimeout(
      () => {
        setHidden(true);
        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch {
          /* private-mode quotas — fine to ignore */
        }
      },
      isTouch ? 700 : 900
    );
    return () => clearTimeout(t);
  }, [hidden]);

  return (
    <div className={`preloader${hidden ? ' is-hidden' : ''}`} aria-hidden={hidden}>
      <div className="preloader__brand">
        SU
        <span className="brand-o" aria-hidden>
          {/* Same Cube as the header Logo — must stay identical so
              the brand mark reads consistent across every surface. */}
          <svg
            width="0.82em"
            height="0.82em"
            viewBox="0 0 60 60"
            style={{ verticalAlign: '-0.08em', margin: '0 0.06em' }}
          >
            <polygon points="30,3 56,15 30,27 4,15" fill="#a8302e" />
            <polygon points="4,15 30,27 30,57 4,45" fill="#4d0a0a" />
            <polygon points="56,15 30,27 30,57 56,45" fill="#8b1a1a" />
          </svg>
        </span>
        FEIYA
      </div>
      <div className="preloader__sub">Crafting Timeless Tailored Spaces · Since 1981</div>
    </div>
  );
}
