'use client';

import { useEffect, useState } from 'react';

/**
 * Preloader echoes the logo: cream "SU•FEIYA" with a burgundy cube
 * standing in for the O. The cube is a literal SVG copy of the
 * favicon so the mark stays consistent across the brand.
 */
export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1400);
    return () => clearTimeout(t);
  }, []);

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
