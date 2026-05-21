import type { MetadataRoute } from 'next';
import { projects, insights } from '@/lib/content';

const base = 'https://suofeiya.example';

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  const staticRoutes = ['', '/projects', '/services', '/studio', '/insights', '/contact', '/careers', '/faq'];

  return [
    ...staticRoutes.map((r) => ({ url: `${base}${r}`, lastModified: today, changeFrequency: 'monthly' as const, priority: r === '' ? 1 : 0.8 })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: today, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...insights.map((i) => ({ url: `${base}/insights/${i.slug}`, lastModified: today, changeFrequency: 'monthly' as const, priority: 0.6 }))
  ];
}
