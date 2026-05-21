import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { caseStudies, projects, IMG, type CaseStudy } from '@/lib/content';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projects.find((p) => p.slug === params.slug);
  return {
    title: project?.title ?? 'Project',
    description: project ? `${project.title} — ${project.category} project · ${project.city}.` : undefined
  };
}

/**
 * Suofeiya project detail page.
 *
 * Implements the page-level addendum §4 template exactly:
 *
 *   1. Hero (100vh full-bleed, centred white title)
 *   2. Intro statement (4-line poetic serif + body paragraph)
 *   3. Metadata bar — Type / Location / Finish Time / Product
 *   4. Asymmetric image gallery, fed by the real per-project images
 *      downloaded from global.suofeiya.com (public/projects/<slug>/)
 *   5. Mid-page second statement (italic burgundy connectors)
 *   6. Feature copy block
 *   7. Metrics row (when a case-study record exists)
 *   8. NEXT PROJECT card with VIEW MORE hover
 *
 * The gallery layout is generated procedurally so it works for
 * projects with 5 images (pavilions) up to 16 (ST Hotel). Frames
 * rotate through a fixed pattern of layout slots: wide / pair-left /
 * tall / pair-right, and we draw from the image list in order.
 */

type Slot =
  | { kind: 'wide'; src: string; alt: string }
  | { kind: 'tall'; src: string; alt: string }
  | { kind: 'pair-left'; main: { src: string; alt: string }; accent: { src: string; alt: string } }
  | { kind: 'pair-right'; main: { src: string; alt: string }; small: { src: string; alt: string } };

function buildGallerySlots(gallery: string[], title: string): Slot[] {
  const slots: Slot[] = [];
  let i = 0;
  const next = (): { src: string; alt: string } | null => {
    if (i >= gallery.length) return null;
    const src = gallery[i++];
    return { src, alt: `${title} — frame ${i}` };
  };
  // Rotate: wide → pair-left → tall → pair-right → wide → …
  const pattern: Slot['kind'][] = ['wide', 'pair-left', 'tall', 'pair-right'];
  let pIdx = 0;
  while (i < gallery.length) {
    const kind = pattern[pIdx++ % pattern.length];
    if (kind === 'wide') {
      const m = next();
      if (!m) break;
      slots.push({ kind: 'wide', ...m });
    } else if (kind === 'tall') {
      const m = next();
      if (!m) break;
      slots.push({ kind: 'tall', ...m });
    } else if (kind === 'pair-left') {
      const m = next();
      const a = next();
      if (!m) break;
      slots.push({ kind: 'pair-left', main: m, accent: a ?? m });
    } else {
      const s = next();
      const m = next();
      if (!s) break;
      slots.push({ kind: 'pair-right', small: s, main: m ?? s });
    }
  }
  return slots;
}

function renderSlot(slot: Slot, idx: number) {
  // Mobile perf: every below-the-fold gallery image is lazy-loaded and
  // quality-capped at 68 (AVIF at q=68 is visually identical to q=75
  // for photographic content but ~25 % smaller on cellular).
  const sharedImgProps = { quality: 68, loading: 'lazy' as const };
  switch (slot.kind) {
    case 'wide':
      return (
        <figure key={idx} className="pd-img pd-img--wide scroll-zoom">
          <Image
            {...sharedImgProps}
            src={slot.src}
            alt={slot.alt}
            width={1600}
            height={900}
            sizes="90vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </figure>
      );
    case 'tall':
      return (
        <figure key={idx} className="pd-img pd-img--tall scroll-zoom">
          <Image
            {...sharedImgProps}
            src={slot.src}
            alt={slot.alt}
            width={600}
            height={800}
            sizes="35vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </figure>
      );
    case 'pair-left':
      return (
        <div key={idx} className="pd-pair pd-pair--left">
          <figure className="pd-img pd-img--medium scroll-zoom">
            <Image
              {...sharedImgProps}
              src={slot.main.src}
              alt={slot.main.alt}
              width={900}
              height={675}
              sizes="55vw"
              style={{ width: '100%', height: 'auto' }}
            />
          </figure>
          <figure className="pd-img pd-img--accent scroll-zoom">
            <Image
              {...sharedImgProps}
              src={slot.accent.src}
              alt={slot.accent.alt}
              width={480}
              height={360}
              sizes="22vw"
              style={{ width: '100%', height: 'auto' }}
            />
          </figure>
        </div>
      );
    case 'pair-right':
      return (
        <div key={idx} className="pd-pair pd-pair--right">
          <figure className="pd-img pd-img--small scroll-zoom">
            <Image
              {...sharedImgProps}
              src={slot.small.src}
              alt={slot.small.alt}
              width={400}
              height={400}
              sizes="30vw"
              style={{ width: '100%', height: 'auto' }}
            />
          </figure>
          <figure className="pd-img pd-img--large scroll-zoom">
            <Image
              {...sharedImgProps}
              src={slot.main.src}
              alt={slot.main.alt}
              width={1200}
              height={900}
              sizes="60vw"
              style={{ width: '100%', height: 'auto' }}
            />
          </figure>
        </div>
      );
  }
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const caseStudy: CaseStudy | undefined = caseStudies.find((c) => c.slug === params.slug);

  // Next project for the bottom-of-page link (looped to start).
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];

  // Gallery source. If we have a case study with real per-project
  // images, use those. Otherwise build a fallback gallery from the
  // shared category frames so every page still has visual material.
  const gallerySource: string[] =
    caseStudy?.gallery && caseStudy.gallery.length > 0
      ? caseStudy.gallery
      : [project.image, IMG.kitchenCabinets, IMG.closet, IMG.bathroomVanity, IMG.interiorDoor, IMG.servicesHome, IMG.livingRoom];

  // First image is the hero; the rest feed the asymmetric gallery.
  const heroImg = gallerySource[0];
  const gallery = gallerySource.slice(1);

  // Split the gallery roughly in half so we can drop the second
  // statement between the two halves.
  const half = Math.ceil(gallery.length / 2);
  const galleryA = gallery.slice(0, half);
  const galleryB = gallery.slice(half);
  const slotsA = buildGallerySlots(galleryA, project.title);
  const slotsB = buildGallerySlots(galleryB, project.title);

  return (
    <>
      {/* 1. Hero */}
      <section className="pd-hero">
        <Image src={heroImg} alt={project.title} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        <div className="pd-hero__scrim" aria-hidden />
        <h1 className="pd-hero__title font-display pd-hero__title--reveal">{project.title}</h1>
      </section>

      {/* 2. Intro statement */}
      <section className="pd-intro">
        {/* `a` vs `an` agreement — Apartment/Office start with a vowel
            sound so they read better with "an". Per §5.3 of the diff
            brief — fixes the broken "a APARTMENT PROGRAM" line seen
            in CURRENT_04_BROKEN_HERO_with_intro.jpg. */}
        {(() => {
          const article = /^[AEIOU]/i.test(project.category) ? 'an' : 'a';
          return (
            <h2 className="pd-intro__statement font-display">
              {caseStudy ? (
                <>
                  CRAFTED <em>by</em> ONE STUDIO,
                  <br />
                  <em>{article}</em> {project.category.toUpperCase()} PROGRAM
                  <br />
                  SHAPED <em>in</em> THE LANGUAGE
                  <br />
                  <em>of</em> SUOFEIYA
                </>
              ) : (
                <>
                  ONE SPECIFICATION,
                  <br />
                  <em>a</em> WHOLE-HOUSE
                  <br />
                  {project.category.toUpperCase()} PROGRAM
                  <br />
                  <em>by</em> SUOFEIYA
                </>
              )}
            </h2>
          );
        })()}
        <p className="pd-intro__body">
          {caseStudy?.body ??
            `A ${project.category.toLowerCase()} program drawn end-to-end by the Suofeiya studio — kitchen, wardrobe, vanity, door and built-in joinery delivered under one specification. DIYHome 3D walkthroughs close every spec question before the boards are cut; site-trained installation crews close the loop from drawing to handover.`}
        </p>
      </section>

      {/* 3. Metadata bar */}
      <dl className="pd-meta">
        <div>
          <dt>Type</dt>
          <dd>{project.category}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{caseStudy?.location ?? project.city}</dd>
        </div>
        {caseStudy ? (
          <div>
            <dt>Finish time</dt>
            <dd>{caseStudy.finishYear}</dd>
          </div>
        ) : null}
        {caseStudy ? (
          <div>
            <dt>Product</dt>
            <dd>{caseStudy.product}</dd>
          </div>
        ) : null}
      </dl>

      {/* 4. Asymmetric gallery — first half */}
      {slotsA.length > 0 ? <section className="pd-gal">{slotsA.map(renderSlot)}</section> : null}

      {/* 5. Mid-page second statement */}
      <section className="pd-intro pd-intro--mid">
        <h2 className="pd-intro__statement font-display">
          <em>A</em> NEW CHAPTER
          <br />
          <em>in</em> WHOLE-HOUSE
          <br />
          LUXURY
        </h2>
        <p className="pd-intro__body">
          {caseStudy?.feature ??
            `Suofeiya draws every room of the project in one studio, manufactures every panel on Industry 4.0 lines across our 8 bases, and installs with site-trained crews. The result is a ${project.category.toLowerCase()} program that arrives intact — board to handover under one supply-chain handshake.`}
        </p>
      </section>

      {/* 4. Asymmetric gallery — second half */}
      {slotsB.length > 0 ? <section className="pd-gal">{slotsB.map(renderSlot)}</section> : null}

      {/* 7. Metrics row */}
      {caseStudy ? (
        <section className="pd-metrics">
          <h3 className="pd-metrics__title font-display">
            By <em>the</em> numbers
          </h3>
          <ul>
            {caseStudy.metrics.map((m) => (
              <li key={m.label}>
                <span className="pd-metrics__val font-display">{m.value}</span>
                <span className="pd-metrics__lab">{m.label}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* 8. NEXT PROJECT */}
      <section className="pd-next">
        <p className="pd-next__eyebrow">Next project</p>
        <Link href={`/projects/${next.slug}`} className="pd-next__card" data-cursor="view more">
          <figure>
            <Image
              src={next.image}
              alt={next.title}
              fill
              sizes="(max-width: 900px) 100vw, 600px"
              style={{ objectFit: 'cover' }}
            />
            <span className="pcard__hover">View more</span>
          </figure>
          <h3 className="pd-next__title font-display">{next.title}</h3>
          <p className="pd-next__desc">
            {next.category} · {next.city} — Suofeiya {next.category.toLowerCase()} program.
          </p>
          <span className="link-underline">View project</span>
        </Link>
        <div className="pd-next__back">
          <Link href="/projects" className="link-underline">
            ← Back to all projects
          </Link>
        </div>
      </section>
    </>
  );
}
