/**
 * Typed wrapper around the extracted Suofeiya mirror dataset.
 *
 * `cms.json` is produced by `scripts/extract_mirror.py` and contains
 * every category and item discovered on global.suofeiya.com:
 *   - 66 list categories  (Wardrobe / Kitchen / Bathroom / Door / ...)
 *   - 155 detail items     (product series, projects, articles)
 *   - Images are referenced by UUID. Each UUID resolves to
 *     `/cms/<uuid>.jpg` — files downloaded in bulk by
 *     `scripts/download_images.sh`.
 *
 * We attach a few helpers and re-export the dataset with typed
 * shapes so dynamic routes can consume it cleanly.
 */
import dataset from './cms.json';

export interface CmsCategory {
  id: string;            // mirror page id, e.g. "11"
  title: string;         // "SUOFEIYA Wardrobe"
  slug: string;          // "suofeiya-wardrobe"
  hero_uuid: string | null;
  item_ids: string[];
}

export interface CmsItem {
  id: string;            // mirror page id, e.g. "12"
  title: string;
  slug: string;
  metadata: Record<string, string>;
  summary: string;
  body: string;
  images: string[];
  category_ids: string[];
  primary_category_id: string | null;
}

interface CmsData {
  categories: CmsCategory[];
  items: CmsItem[];
}

const typedDataset = dataset as unknown as CmsData;

/** Categories with at least one mapped item — the ones worth showing. */
export const categories: CmsCategory[] = typedDataset.categories
  .filter((c) => c.item_ids.length > 0)
  .sort((a, b) => b.item_ids.length - a.item_ids.length);

export const items: CmsItem[] = typedDataset.items;

const categoryById: Map<string, CmsCategory> = new Map(typedDataset.categories.map((c) => [c.id, c]));
const itemById: Map<string, CmsItem> = new Map(typedDataset.items.map((i) => [i.id, i]));

/** Map from category slug → category record (used by /catalog/[cat]). */
export const categoryBySlug: Map<string, CmsCategory> = new Map(categories.map((c) => [c.slug, c]));

/** Map from "<category-slug>/<item-slug>" → item record. */
export const itemByPath: Map<string, CmsItem> = new Map();
for (const cat of categories) {
  for (const iid of cat.item_ids) {
    const it = itemById.get(iid);
    if (!it) continue;
    itemByPath.set(`${cat.slug}/${it.slug}`, it);
  }
}

/** Resolve a CMS image UUID to its bundled static path. */
export function cmsImage(uuid: string | null | undefined): string | null {
  if (!uuid) return null;
  return `/cms/${uuid}.jpg`;
}

/** All categories an item belongs to, as records (not just ids). */
export function categoriesOf(item: CmsItem): CmsCategory[] {
  return item.category_ids
    .map((id) => categoryById.get(id))
    .filter((c): c is CmsCategory => Boolean(c));
}

/** Items of a category, in mirror order. */
export function itemsOfCategory(cat: CmsCategory): CmsItem[] {
  return cat.item_ids.map((id) => itemById.get(id)).filter((i): i is CmsItem => Boolean(i));
}

/** Slug→slug index of every catalog path the app exposes. */
export function allCatalogPaths(): { category: string; item: string }[] {
  const out: { category: string; item: string }[] = [];
  for (const cat of categories) {
    for (const it of itemsOfCategory(cat)) {
      out.push({ category: cat.slug, item: it.slug });
    }
  }
  return out;
}
