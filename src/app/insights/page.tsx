import type { Metadata } from 'next';
import InsightsClient from './InsightsClient';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Suofeiya Press & Insights — whole-house design, Industry 4.0 manufacturing, DIYHome 3D, NAF eco-friendly board and B2B partnership programs.'
};

export default function InsightsPage() {
  return (
    <>
      <header className="insights-hero">
        <p className="insights-hero__eyebrow">Press · Insights</p>
        <h1 className="insights-hero__title font-display">
          The Suofeiya <em>Journal</em>
        </h1>
        <p className="insights-hero__sub">
          Go beyond the finished space — insights from the studio, the manufacturing line and the press cycle.
          Whole-house design, Industry 4.0 manufacture, NAF / SGS material standards and the B2B partnership playbook.
        </p>
      </header>
      <InsightsClient />
    </>
  );
}
