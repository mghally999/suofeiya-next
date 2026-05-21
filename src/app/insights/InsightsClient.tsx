'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { insights, type InsightIndustry, type InsightFamily } from '@/lib/content';

/**
 * Insights index — page-level addendum §5.
 *
 * Two-axis filter:
 *   - INDUSTRY: Residential / Commercial / Development
 *   - INSIGHTS: Insights / Press
 *
 * Each card has its publication banner overlaid on the image in a
 * giant cream Cormorant Garamond, mirrored from the addendum's
 * description of the elicyon publication-overlay cards. Adapted to
 * Suofeiya by using Suofeiya-relevant publication names.
 *
 * Filters are multi-select within each group. Empty selection means
 * "no filter on that axis".
 */
const industries: InsightIndustry[] = ['RESIDENTIAL', 'COMMERCIAL', 'DEVELOPMENT'];
const families: InsightFamily[] = ['INSIGHTS', 'PRESS'];

export default function InsightsClient() {
  const [ind, setInd] = useState<Set<InsightIndustry>>(new Set());
  const [fam, setFam] = useState<Set<InsightFamily>>(new Set());

  const toggle = <T,>(set: Set<T>, value: T, setter: (n: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const filtered = useMemo(() => {
    return insights.filter((i) => {
      const indOk = ind.size === 0 || ind.has(i.industry);
      const famOk = fam.size === 0 || fam.has(i.family);
      return indOk && famOk;
    });
  }, [ind, fam]);

  return (
    <>
      <div className="if">
        <div className="if__group">
          <p className="if__label">Industry</p>
          {industries.map((i) => (
            <button
              key={i}
              type="button"
              className={`if-btn${ind.has(i) ? ' is-active' : ''}`}
              onClick={() => toggle(ind, i, setInd)}
              aria-pressed={ind.has(i)}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="if__group">
          <p className="if__label">Insights</p>
          {families.map((f) => (
            <button
              key={f}
              type="button"
              className={`if-btn${fam.has(f) ? ' is-active' : ''}`}
              onClick={() => toggle(fam, f, setFam)}
              aria-pressed={fam.has(f)}
            >
              {f}
            </button>
          ))}
        </div>
        {(ind.size > 0 || fam.size > 0) ? (
          <button
            type="button"
            className="if__clear"
            onClick={() => {
              setInd(new Set());
              setFam(new Set());
            }}
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <section className="ig">
        {filtered.map((card, i) => (
          <Link
            key={card.slug}
            href={`/insights/${card.slug}`}
            className={`ig-card ig-card--${i % 3 === 0 ? 'tall' : i % 3 === 1 ? 'sq' : 'wide'}`}
            data-cursor="read"
          >
            <figure className="ig-card__media">
              <Image src={card.image} alt={card.title} fill sizes="(max-width: 900px) 100vw, 32vw" style={{ objectFit: 'cover' }} />
              <span className="ig-card__scrim" aria-hidden />
              <span className="ig-card__pub font-display">{card.publication}</span>
            </figure>
            <p className="ig-card__eyebrow">{card.family}</p>
            <h3 className="ig-card__title font-display">{card.title}</h3>
            <p className="ig-card__sub">{card.sub}</p>
            <span className="link-underline">Read more</span>
          </Link>
        ))}
        {filtered.length === 0 ? (
          <p className="ig-empty">No insights match those filters.</p>
        ) : null}
      </section>
    </>
  );
}
