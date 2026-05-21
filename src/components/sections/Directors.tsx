'use client';

import Image from 'next/image';
import { useState } from 'react';
import { directors } from '@/lib/content';

/**
 * Studio Directors carousel — page-level addendum §6.
 *
 * Five portraits in a row. The centred portrait is wrapped in a
 * terracotta frame and is in full opacity; the others are slightly
 * dimmed. Clicking a non-active portrait promotes it to the centre,
 * fades the detail block out (200ms) and back in with the new bio.
 */
export default function Directors() {
  const [active, setActive] = useState(0);
  const current = directors[active];

  return (
    <section className="dirs" id="directors">
      <p className="dirs__eyebrow">Suofeiya Studio</p>
      <h2 className="dirs__title font-display">
        <em>Directors</em>
      </h2>
      <div className="dirs__rail" role="tablist">
        {directors.map((d, i) => (
          <button
            key={d.name}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`dir${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
            data-cursor={i === active ? '' : 'meet'}
          >
            <figure className={i === active ? 'dir__frame' : ''}>
              <Image src={d.image} alt={d.name} fill sizes="(max-width: 900px) 40vw, 280px" style={{ objectFit: 'cover' }} />
            </figure>
          </button>
        ))}
      </div>
      <div className="dirs__detail" key={active}>
        <p className="dir__role">{current.role}</p>
        <h3 className="dir__name font-display">{current.name}</h3>
        {current.bio.map((p, i) => (
          <p key={i} className="dir__bio">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
