'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { projects, type Project } from '@/lib/content';

/**
 * Projects index — 3-column featured-anchor masonry (per §3 of the
 * services/projects diff brief and ELICYON_06/07 reference frames).
 *
 *   row layout:    [ FEATURED · 1.8fr ][ SMALL | SMALL · 1fr ]
 *
 * Each row anchors a featured card on the left and stacks up to two
 * smaller cards on the right (the second small card is offset 120px
 * down via CSS, giving elicyon's staggered rhythm without any
 * hand-tuned per-card variant rotation).
 *
 * The old 2-column staggered grid + `cardVariant` index pattern
 * (and the 200px margin-top hack on the right column) is gone —
 * variant is now just `featured | small` and is driven by the row
 * layout itself.
 *
 * Hover:
 *   - image scales 1.04
 *   - centered `↗ View more` overlay fades in over a dark scrim
 *   - eyebrow becomes burgundy on title hover
 *
 * Eyebrow format: `CITY • CATEGORY` (centered-dot bullet U+2022),
 * city in caps — matches elicyon exactly.
 *
 * WIP chip: terracotta `Work in progress` ribbon on three projects
 * known to be unfinished.
 *
 * Filters: multi-select toggles (Apartment / Hotel / Villa / Office).
 * Grid/list view toggle on the right swaps the masonry for a
 * stacked-row layout.
 */
type Category = Project['category'];
const CATEGORIES: Category[] = ['Apartment', 'Hotel', 'Villa', 'Office'];

const WIP_SLUGS = new Set<string>(['urban-residences', 'business-hotel', 'design-studio-cabinetry']);

type CardVariant = 'featured' | 'small';

export default function ProjectsClient() {
  const [active, setActive] = useState<Set<Category>>(new Set());
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo<Project[]>(() => {
    if (active.size === 0) return projects;
    return projects.filter((p) => active.has(p.category));
  }, [active]);

  const toggle = (c: Category) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });

  // Pack into rows: [featured, smallA, smallB], [featured, smallA, smallB], …
  const rows = useMemo(() => {
    const out: Array<{ featured: Project; small: Project[] }> = [];
    let i = 0;
    while (i < filtered.length) {
      const featured = filtered[i++];
      const small = filtered.slice(i, i + 2);
      i += small.length;
      out.push({ featured, small });
    }
    return out;
  }, [filtered]);

  return (
    <>
      <div className="pf">
        <div className="pf__left">
          <p className="pf__label">Filter projects</p>
          <div className="pf__buttons">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`pf-btn${active.has(c) ? ' is-active' : ''}`}
                onClick={() => toggle(c)}
                aria-pressed={active.has(c)}
                data-cursor="toggle"
              >
                {c}
              </button>
            ))}
            {active.size > 0 ? (
              <button
                type="button"
                className="pf-btn pf-btn--clear"
                onClick={() => setActive(new Set())}
                data-cursor="clear"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
        <div className="pf__right" role="group" aria-label="View toggle">
          <button
            type="button"
            className={`pf-view${view === 'grid' ? ' is-active' : ''}`}
            onClick={() => setView('grid')}
            aria-label="Grid view"
            data-cursor="grid"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
              <rect x="0" y="0" width="7" height="7" />
              <rect x="9" y="0" width="7" height="7" />
              <rect x="0" y="9" width="7" height="7" />
              <rect x="9" y="9" width="7" height="7" />
            </svg>
          </button>
          <button
            type="button"
            className={`pf-view${view === 'list' ? ' is-active' : ''}`}
            onClick={() => setView('list')}
            aria-label="List view"
            data-cursor="list"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
              <rect x="0" y="2" width="16" height="2" />
              <rect x="0" y="7" width="16" height="2" />
              <rect x="0" y="12" width="16" height="2" />
            </svg>
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <section className="pf-rows">
          {rows.map((row, rIdx) => (
            <div key={`${row.featured.slug}-${rIdx}`} className="pf-row">
              <ProjectCardCmp project={row.featured} variant="featured" />
              <div className="pf-row__pair">
                {row.small.map((p) => (
                  <ProjectCardCmp key={p.slug} project={p} variant="small" />
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="plist">
          {filtered.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="plist__row" data-cursor="view">
              <div className="plist__media">
                <Image src={p.image} alt={p.title} fill sizes="(max-width: 900px) 100vw, 40vw" style={{ objectFit: 'cover' }} />
                {WIP_SLUGS.has(p.slug) ? <span className="pcard__wip">Work in progress</span> : null}
              </div>
              <div className="plist__body">
                <span className="pcard__eyebrow">
                  {p.city.toUpperCase()} <span aria-hidden>•</span> {p.category.toUpperCase()}
                </span>
                <h3 className="plist__title font-display">{p.title}</h3>
                <span className="link-underline">View project</span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </>
  );
}

function ProjectCardCmp({ project, variant }: { project: Project; variant: CardVariant }) {
  const isWip = WIP_SLUGS.has(project.slug);
  return (
    <article className={`pcard pcard--${variant}`}>
      <Link href={`/projects/${project.slug}`} data-cursor="view more">
        <figure className="pcard__media scroll-zoom">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes={
              variant === 'featured'
                ? '(max-width: 900px) 100vw, 60vw'
                : '(max-width: 900px) 100vw, 30vw'
            }
            style={{ objectFit: 'cover' }}
          />
          {isWip ? <span className="pcard__wip">Work in progress</span> : null}
          <span className="pcard__hover">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M0 0 L14 5 L6 7 L4 14 Z" fill="currentColor" />
            </svg>
            View more
          </span>
        </figure>
        <p className="pcard__eyebrow">
          {project.city.toUpperCase()} <span aria-hidden>•</span> {project.category.toUpperCase()}
        </p>
        <h3 className="pcard__title font-display">{project.title}</h3>
      </Link>
    </article>
  );
}
