import Link from 'next/link';

export default function GetInTouchCTA() {
  return (
    <section className="cta-touch">
      <h2>
        BUILD YOUR <em>WHOLE&nbsp;HOUSE</em>
        <br />
        WITH ONE STUDIO &amp; ONE SPECIFICATION
      </h2>
      <Link href="/contact" className="link-underline">
        Get a quote
      </Link>
    </section>
  );
}
