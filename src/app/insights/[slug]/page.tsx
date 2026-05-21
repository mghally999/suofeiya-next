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

export default function InsightDetail({ params }: { params: { slug: string } }) {
  const insight = insights.find((i) => i.slug === params.slug);
  if (!insight) notFound();

  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh', paddingTop: 80 }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
        <Image src={insight.image} alt={insight.title} fill priority sizes="50vw" style={{ objectFit: 'cover' }} />
      </div>
      <div style={{ padding: '120px 60px' }}>
        <p className="eyebrow" style={{ marginBottom: 24 }}>
          {insight.eyebrow}
        </p>
        <h1 className="font-display" style={{ fontSize: 'clamp(36px, 4vw, 64px)', lineHeight: 1.05, margin: 0 }}>
          {insight.title}
        </h1>
        <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, marginTop: 24, color: 'var(--text-dim)' }}>
          {insight.sub}
        </p>
        <div style={{ marginTop: 60, fontSize: 16, lineHeight: 1.75, color: 'var(--text)', maxWidth: 540 }}>
          <p>
            Sited on a quiet plot, the project unfolds as a sequence of considered rooms — each tuned to a different ritual of
            the day. Natural materials carry the architectural rhythm: travertine for the thresholds, smoked oak for the
            joinery, raw linen for the soft surfaces.
          </p>
          <p style={{ marginTop: 24 }}>
            The brief asked for a home that felt timeless without ever feeling untouchable. Suofeiya answered with cabinetry
            drawn at full scale in our atelier, materials selected leaf-by-leaf, and a delivery sequence that left no seam
            visible at handover.
          </p>
        </div>
        <div style={{ marginTop: 80 }}>
          <Link href="/insights" className="link-underline">
            ← Back to journal
          </Link>
        </div>
      </div>
    </section>
  );
}
