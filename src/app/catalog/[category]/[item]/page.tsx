import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allCatalogPaths, categoryBySlug, cmsImage, itemByPath, itemsOfCategory } from '@/lib/cms';

export function generateStaticParams() {
  return allCatalogPaths().map((p) => ({ category: p.category, item: p.item }));
}

export function generateMetadata({ params }: { params: { category: string; item: string } }): Metadata {
  const it = itemByPath.get(`${params.category}/${params.item}`);
  return {
    title: it ? `${it.title}` : 'Item',
    description: it ? it.summary || `${it.title} — Suofeiya catalog.` : undefined
  };
}

/**
 * Per-item detail page driven entirely from the mirrored CMS data.
 *
 *   - Hero is the first image, with the title centered as overlay
 *   - Metadata bar surfaces every key/value extracted (`.dsc` table)
 *   - Body paragraph from the mirror summary/body text
 *   - Gallery shows the remaining images in an asymmetric flow
 *   - Sidebar links to sibling items in the same category
 */
export default function CatalogItemPage({
  params
}: {
  params: { category: string; item: string };
}) {
  const cat = categoryBySlug.get(params.category);
  const it = itemByPath.get(`${params.category}/${params.item}`);
  if (!cat || !it) notFound();

  const hero = cmsImage(it.images[0]);
  const gallery = it.images.slice(1).map(cmsImage).filter(Boolean) as string[];

  // Siblings: other items in the same category, excluding this one.
  const siblings = itemsOfCategory(cat).filter((s) => s.id !== it.id).slice(0, 6);

  const metaEntries = Object.entries(it.metadata ?? {});

  return (
    <>
      <section className="pd-hero">
        {hero ? (
          <Image src={hero} alt={it.title} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ background: 'var(--bg-charcoal)', width: '100%', height: '100%' }} />
        )}
        <div className="pd-hero__scrim" aria-hidden />
        <h1 className="pd-hero__title font-display">{it.title}</h1>
      </section>

      <section className="pd-intro">
        <p className="catalog-hero__eyebrow">
          <Link href="/catalog" className="catalog-hero__crumb">
            Catalog
          </Link>{' '}
          ·{' '}
          <Link href={`/catalog/${cat.slug}`} className="catalog-hero__crumb">
            {cat.title}
          </Link>
        </p>
        <h2 className="pd-intro__statement font-display" style={{ fontSize: 'clamp(28px, 3.4vw, 52px)' }}>
          {it.title}
        </h2>
        {it.summary ? <p className="pd-intro__body">{it.summary}</p> : null}
      </section>

      {metaEntries.length > 0 ? (
        <dl className="pd-meta">
          {metaEntries.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {gallery.length > 0 ? (
        <section className="pd-gal">
          {gallery.map((src, i) => {
            const slot = i % 4;
            const cls =
              slot === 0
                ? 'pd-img pd-img--wide scroll-zoom'
                : slot === 1
                  ? 'pd-img pd-img--medium scroll-zoom'
                  : slot === 2
                    ? 'pd-img pd-img--tall scroll-zoom'
                    : 'pd-img pd-img--large scroll-zoom';
            return (
              <figure key={i} className={cls}>
                <Image
                  src={src}
                  alt={`${it.title} — frame ${i + 1}`}
                  width={1200}
                  height={900}
                  sizes="(max-width: 900px) 100vw, 60vw"
                  style={{ width: '100%', height: 'auto' }}
                />
              </figure>
            );
          })}
        </section>
      ) : null}

      {it.body && it.body !== it.summary ? (
        <section className="pd-intro pd-intro--mid">
          <p className="pd-intro__body" style={{ maxWidth: 720, fontSize: 16 }}>
            {it.body}
          </p>
        </section>
      ) : null}

      {siblings.length > 0 ? (
        <section className="pd-next">
          <p className="pd-next__eyebrow">More in {cat.title}</p>
          <div className="cat-items cat-items--compact">
            {siblings.map((s) => {
              const cover = cmsImage(s.images[0]);
              return (
                <Link key={s.id} href={`/catalog/${cat.slug}/${s.slug}`} className="cat-item" data-cursor="view">
                  <figure className="scroll-zoom">
                    {cover ? (
                      <Image src={cover} alt={s.title} fill sizes="(max-width: 900px) 50vw, 22vw" style={{ objectFit: 'cover' }} />
                    ) : null}
                  </figure>
                  <h3 className="cat-item__title font-display">{s.title}</h3>
                </Link>
              );
            })}
          </div>
          <div className="pd-next__back">
            <Link href={`/catalog/${cat.slug}`} className="link-underline">
              ← Back to {cat.title}
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
