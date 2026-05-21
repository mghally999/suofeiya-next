'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { projects, type Project } from '@/lib/content';

/**
 * Masonry-style projects index — patterned exactly on the addendum:
 *
 * - 2-column grid where the right column is initially offset 200px
 *   down from the left so cards stagger visually instead of sitting
 *   on shared baselines.
 * - Card sizes mix standard portrait, standard landscape, wide
 *   featured and tall featured. We assign each card a variant
 *   deterministically from its index so the layout is stable
 *   across renders and filter swaps.
 * - Hover: image scales 1.03, a centred VIEW MORE label fades in,
 *   and a subtle dark scrim overlays the photo.
 * - A WORK IN PROGRESS chip in Suofeiya terracotta marks projects
 *   not yet delivered.
 * - Filter buttons are multi-select toggles: clicking an inactive
 *   filter adds it, clicking an active one removes it. Empty
 *   selection shows everything.
 * - A grid/list view toggle on the right swaps masonry for a
 *   stacked-row layout.
 */
type Category = Project['category'];
const categories: Category[] = ['Apartment', 'Hotel', 'Villa', 'Office'];

const WIP_SLUGS = new Set<string>([
  'urban-residences',
  'business-hotel',
  'design-studio-cabinetry'
]);

const cardVariant = (i: number): 'standard' | 'wide' | 'tall' | 'landscape' => {
  // Hand-tuned rotation that produces the magazine feel: a tall anchor
  // at top-left, then occasional wides and landscapes break the rhythm.
  const pattern = ['tall', 'standard', 'standard', 'wide', 'landscape', 'standard', 'tall', 'standard', 'wide', 'standard', 'landscape', 'standard'] as const;
  return pattern[i % pattern.length];
};

export default function ProjectsClient() {
  const [active, setActive] = useState<Set<Category>>(new Set());
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo<Project[]>(() => {
    if (active.size === 0) return projects;
    return projects.filter((p) => active.has(p.category));
  }, [active]);

  const toggle = (c: Category) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  // Distribute cards into two columns for the staggered masonry.
  const { left, right } = useMemo(() => {
    const l: Array<Project & { variant: ReturnType<typeof cardVariant> }> = [];
    const r: typeof l = [];
    filtered.forEach((p, i) => {
      const v = cardVariant(i);
      (i % 2 === 0 ? l : r).push({ ...p, variant: v });
    });
    return { left: l, right: r };
  }, [filtered]);

  return (
    <>
      <div className="pf">
        <div className="pf__left">
          <p className="pf__label">Filter projects</p>
          <div className="pf__buttons">
            {categories.map((c) => (
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
        <section className="pmasonry">
          <div className="pmasonry__col pmasonry__col--left">
            {left.map((p, i) => (
              <ProjectCardCmp key={p.slug} project={p} index={i} />
            ))}
          </div>
          <div className="pmasonry__col pmasonry__col--right">
            {right.map((p, i) => (
              <ProjectCardCmp key={p.slug} project={p} index={i} />
            ))}
          </div>
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
                  {p.city} <span aria-hidden>·</span> {p.category.toUpperCase()}
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

function ProjectCardCmp({
  project,
  index
}: {
  project: Project & { variant: 'standard' | 'wide' | 'tall' | 'landscape' };
  index: number;
}) {
  const isWip = WIP_SLUGS.has(project.slug);
  return (
    <article className={`pcard pcard--${project.variant}`} style={{ animationDelay: `${index * 0.05}s` }}>
      <Link href={`/projects/${project.slug}`} data-cursor="view more">
        <figure className="pcard__media scroll-zoom">
          <Image src={project.image} alt={project.title} fill sizes="(max-width: 900px) 100vw, 45vw" style={{ objectFit: 'cover' }} />
          {isWip ? <span className="pcard__wip">Work in progress</span> : null}
          <span className="pcard__hover">View more</span>
        </figure>
        <p className="pcard__eyebrow">
          {project.city} <span aria-hidden>·</span> {project.category.toUpperCase()}
        </p>
        <h3 className="pcard__title font-display">{project.title}</h3>
      </Link>
    </article>
  );
}
