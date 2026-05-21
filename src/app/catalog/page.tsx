import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { categories, cmsImage, itemsOfCategory } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Catalog',
  description:
    'The full Suofeiya catalog: every product, series, project and reference mirrored from global.suofeiya.com — kitchen, wardrobe, vanity, door, loose furniture, hardware and more.'
};

/**
 * Catalog index — every active category surfaced from the
 * suofeiya mirror, with a thumbnail pulled from the first item.
 */
export default function CatalogPage() {
  return (
    <>
      <section className="catalog-hero">
        <p className="catalog-hero__eyebrow">Suofeiya · Catalog</p>
        <h1 className="catalog-hero__title font-display">
          The full <em>Suofeiya</em> catalog
        </h1>
        <p className="catalog-hero__sub">
          {categories.length} categories · {categories.reduce((n, c) => n + c.item_ids.length, 0)} products, series and
          projects mirrored from global.suofeiya.com — kitchen, wardrobe, bathroom vanity, interior door, whole-house
          design and the full B2B program.
        </p>
      </section>

      <section className="catalog-grid">
        {categories.map((cat) => {
          const items = itemsOfCategory(cat);
          const hero = cmsImage(cat.hero_uuid) ?? cmsImage(items.find((i) => i.images.length > 0)?.images[0]);
          return (
            <Link key={cat.id} href={`/catalog/${cat.slug}`} className="cat-card" data-cursor="explore">
              <figure className="scroll-zoom">
                {hero ? <Image src={hero} alt={cat.title} fill sizes="(max-width: 900px) 100vw, 32vw" style={{ objectFit: 'cover' }} /> : null}
                <span className="cat-card__count">{cat.item_ids.length}</span>
                <span className="cat-card__hover">Enter category</span>
              </figure>
              <h3 className="cat-card__title font-display">{cat.title}</h3>
              <p className="cat-card__meta">
                {cat.item_ids.length} item{cat.item_ids.length === 1 ? '' : 's'}
              </p>
            </Link>
          );
        })}
      </section>
    </>
  );
}
