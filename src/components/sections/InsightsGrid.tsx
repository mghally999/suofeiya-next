import Image from 'next/image';
import Link from 'next/link';
import { insights } from '@/lib/content';

export default function InsightsGrid() {
  return (
    <section className="insights">
      <div className="insights__head">
        <p>Go beyond the finished space. Explore the insights, inspiration, collaborations and ideas that quietly shape our world.</p>
        <Link href="/insights" className="link-underline">
          Explore insights
        </Link>
      </div>
      <div className="insights__grid">
        {insights.map((card) => (
          <Link key={card.slug} href={`/insights/${card.slug}`} className="insight-card" data-cursor="read more">
            <div className="insight-card__img">
              <Image src={card.image} alt={card.title} fill sizes="(max-width: 900px) 100vw, 30vw" style={{ objectFit: 'cover' }} />
            </div>
            <div className="insight-card__eyebrow">{card.eyebrow}</div>
            <h3 className="insight-card__title">{card.title}</h3>
            <p className="insight-card__sub">{card.sub}</p>
            <span className="link-underline">Read more</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
