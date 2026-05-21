import type { Metadata } from 'next';
import FAQClient from './FAQClient';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about working with Suofeiya.'
};

export default function FAQPage() {
  return (
    <section className="faq">
      <h1>
        FAQ <em style={{ fontStyle: 'italic' }}>.</em>
      </h1>
      <FAQClient />
    </section>
  );
}
