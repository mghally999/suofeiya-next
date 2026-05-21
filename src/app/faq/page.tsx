import type { Metadata } from 'next';
import Image from 'next/image';
import FAQClient from './FAQClient';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about working with Suofeiya.'
};

const HERO_IMG = '/cms/169ae3ec-c5d4-4a8f-a773-97a23f301244.jpg';

export default function FAQPage() {
  return (
    <>
      <section className="services-hero">
        <Image src={HERO_IMG} alt="Suofeiya — frequently asked questions" fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        <div className="services-hero__scrim" aria-hidden />
        <h1 className="services-hero__title font-display services-hero__title--reveal">FAQ</h1>
      </section>

      <section className="faq">
        <FAQClient />
      </section>
    </>
  );
}
