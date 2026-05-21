'use client';

import { useState } from 'react';
import { faqs } from '@/lib/content';

export default function FAQClient() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="faq-list">
      {faqs.map((item, i) => (
        <li key={item.q} className={`faq-item${open === i ? ' is-open' : ''}`}>
          <button
            type="button"
            className="faq-item__q"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            data-cursor={open === i ? 'close' : 'open'}
          >
            <span>{item.q}</span>
            <span className="faq-item__plus" aria-hidden>
              +
            </span>
          </button>
          <div className="faq-item__a">
            <p>{item.a}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
