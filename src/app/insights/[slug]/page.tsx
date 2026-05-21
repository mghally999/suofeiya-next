import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { insights } from '@/lib/content';

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const insight = insights.find((i) => i.slug === params.slug);
  return {
    title: insight?.title ?? 'Insight',
    description: insight?.sub
  };
}

/**
 * Insight detail page — same hero/intro typographic rhythm as
 * /services and /projects/[slug]: full-bleed image, clip-in title
 * overlay, then a centred body. The bottom section surfaces 3
 * related insights so readers stay inside the journal flow.
 */
export default function InsightDetail({ params }: { params: { slug: string } }) {
  const insight = insights.find((i) => i.slug === params.slug);
  if (!insight) notFound();

  // 3 sibling insights (any except this one)
  const siblings = insights.filter((i) => i.slug !== insight.slug).slice(0, 3);

  return (
    <>
      <section className="services-hero">
        <Image src={insight.image} alt={insight.title} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        <div className="services-hero__scrim" aria-hidden />
        <span className="insight-detail__publication font-display" aria-hidden>
          {insight.publication}
        </span>
        <h1 className="services-hero__title font-display services-hero__title--reveal" style={{ fontSize: 'clamp(34px, 5vw, 72px)' }}>
          {insight.title}
        </h1>
      </section>

      <section className="pd-intro">
        <p className="catalog-hero__eyebrow">
          <Link href="/insights" className="catalog-hero__crumb">
            The Journal
          </Link>{' '}
          · {insight.family}
        </p>
        <h2 className="pd-intro__statement font-display" style={{ fontSize: 'clamp(28px, 3.4vw, 48px)' }}>
          {insight.sub}
        </h2>
        <div className="pd-intro__body" style={{ textAlign: 'left' }}>
          <p>
            Sited on a considered plot, the Suofeiya whole-house program unfolds as a sequence of rooms tuned to the
            way a household actually lives. Natural materials carry the architectural rhythm: travertine for the
            thresholds, smoked oak for the joinery, raw linen for the soft surfaces.
          </p>
          <p style={{ marginTop: 18 }}>
            The brief — whether it was for an apartment program, a hotel suite roll-out or a private villa —
            asked for a home that felt timeless without ever feeling untouchable. Suofeiya answered with cabinetry
            drawn at full scale in our atelier, materials selected leaf-by-leaf, NAF / SGS formaldehyde-free board
            shipped to spec, and a delivery sequence that left no seam visible at handover.
          </p>
          <p style={{ marginTop: 18 }}>
            More on the studio's <Link href="/services" className="link-underline">five-step delivery loop</Link> ·{' '}
            <Link href="/studio#manufacturing" className="link-underline">manufacturing network</Link> ·{' '}
            <Link href="/projects" className="link-underline">B2B project portfolio</Link>.
          </p>
        </div>
      </section>

      {siblings.length > 0 ? (
        <section className="pd-next">
          <p className="pd-next__eyebrow">More from the Journal</p>
          <div className="ig" style={{ paddingTop: 24 }}>
            {siblings.map((s) => (
              <Link key={s.slug} href={`/insights/${s.slug}`} className="ig-card" data-cursor="read">
                <figure className="ig-card__media scroll-zoom">
                  <Image src={s.image} alt={s.title} fill sizes="(max-width: 900px) 100vw, 32vw" style={{ objectFit: 'cover' }} />
                  <span className="ig-card__scrim" aria-hidden />
                  <span className="ig-card__pub font-display">{s.publication}</span>
                </figure>
                <p className="ig-card__eyebrow">{s.family}</p>
                <h3 className="ig-card__title font-display">{s.title}</h3>
                <p className="ig-card__sub">{s.sub}</p>
                <span className="link-underline">Read more</span>
              </Link>
            ))}
          </div>
          <div className="pd-next__back">
            <Link href="/insights" className="link-underline">
              ← Back to the Journal
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
