import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, categoryBySlug, cmsImage, itemsOfCategory } from '@/lib/cms';

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const cat = categoryBySlug.get(params.category);
  return {
    title: cat ? `${cat.title} · Catalog` : 'Catalog',
    description: cat ? `Browse the Suofeiya ${cat.title} collection — ${cat.item_ids.length} items.` : undefined
  };
}

/**
 * Category page — masonry of every item in this Suofeiya category.
 * Each card links into the per-item detail page.
 */
export default function CategoryPage({ params }: { params: { category: string } }) {
  const cat = categoryBySlug.get(params.category);
  if (!cat) notFound();

  const items = itemsOfCategory(cat);

  return (
    <>
      <section className="catalog-hero">
        <p className="catalog-hero__eyebrow">
          <Link href="/catalog" className="catalog-hero__crumb">
            Catalog
          </Link>{' '}
          · {cat.title}
        </p>
        <h1 className="catalog-hero__title font-display">
          <em>{cat.title}</em>
        </h1>
        <p className="catalog-hero__sub">
          {items.length} item{items.length === 1 ? '' : 's'} in this Suofeiya collection — every product mirrored from
          global.suofeiya.com with full descriptions, metadata and photography.
        </p>
      </section>

      <section className="cat-items">
        {items.map((item) => {
          const cover = cmsImage(item.images[0]);
          return (
            <Link
              key={item.id}
              href={`/catalog/${cat.slug}/${item.slug}`}
              className="cat-item"
              data-cursor="view"
            >
              <figure className="scroll-zoom">
                {cover ? (
                  <Image
                    src={cover}
                    alt={item.title}
                    fill
                    sizes="(max-width: 900px) 50vw, 25vw"
                    quality={70}
                    style={{ objectFit: 'cover' }}
                  />
                ) : null}
                <span className="cat-item__hover">View item</span>
              </figure>
              <h3 className="cat-item__title font-display">{item.title}</h3>
              {item.metadata?.['Product'] || item.metadata?.['Project'] ? (
                <p className="cat-item__meta">{item.metadata['Product'] ?? item.metadata['Project']}</p>
              ) : null}
            </Link>
          );
        })}
      </section>
    </>
  );
}
