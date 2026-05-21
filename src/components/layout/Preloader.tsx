'use client';

import { useEffect, useState } from 'react';

/**
 * Preloader echoes the logo: cream "SU•FEIYA" with a burgundy cube
 * standing in for the O. The cube is a literal SVG copy of the
 * favicon so the mark stays consistent across the brand.
 *
 * IMPORTANT — gated behind sessionStorage. The preloader is in the
 * root layout, so on every client-side Link navigation the layout
 * (and this component) remounts and the 1.4s timer restarts. That
 * was covering the hero of every project-detail page with a black
 * sheet for 1.4 seconds — making the hero look "broken" until the
 * user scrolled past it. We now show the preloader ONCE per browser
 * session and skip it entirely on subsequent navigations.
 */
const SESSION_KEY = '__sf_preloader_shown';

export default function Preloader() {
  // Synchronously decide on the FIRST render whether the preloader
  // should appear at all. If this is a client-side nav within the
  // same session, skip entirely.
  const [hidden, setHidden] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (hidden) return; // already shown this session
    const t = setTimeout(() => {
      setHidden(true);
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* private-mode quotas etc — fine to ignore */
      }
    }, 900); // tightened from 1400ms — 0.9s is plenty for the brand mark
    return () => clearTimeout(t);
  }, [hidden]);

  return (
    <div className={`preloader${hidden ? ' is-hidden' : ''}`} aria-hidden={hidden}>
      <div className="preloader__brand">
        SU
        <span className="brand-o" aria-hidden>
          <svg width="0.78em" height="0.78em" viewBox="0 0 44 44" style={{ verticalAlign: '-0.06em', margin: '0 0.05em' }}>
            <polygon points="22,0 44,11 22,22 0,11" fill="#a8302e" />
            <polygon points="0,11 22,22 22,44 0,33" fill="#6e1414" />
            <polygon points="44,11 22,22 22,44 44,33" fill="#8b1a1a" />
          </svg>
        </span>
        FEIYA
      </div>
      <div className="preloader__sub">Crafting Timeless Tailored Spaces · Since 1981</div>
    </div>
  );
}
