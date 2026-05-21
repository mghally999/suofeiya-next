'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { objectsRail } from '@/lib/content';
import { DoublyLinkedList } from '@/lib/ds';

/**
 * "OBJECTS of DESIRE" rail — Suofeiya hero pieces. Captions are
 * rewritten to match the brand's whole-house/cabinetry vocabulary
 * (DIYHome, NAF boards, in-house joinery) rather than generic
 * studio-product copy.
 */
const captions: Record<number, { title: string; copy: string }> = {
  0: {
    title: 'CLOSET & WARDROBE — DRESSING SYSTEM',
    copy: 'A modular walk-in dressing program in matt-lacquer oak with brushed-bronze rails. Drawn around the architecture in DIYHome before a single panel is cut.'
  },
  1: {
    title: 'BATHROOM VANITY — STONE & WALNUT',
    copy: 'Stone counter over a moisture-resistant walnut carcass with integrated linear lighting. Boards reach NAF / SGS formaldehyde-free certification.'
  },
  2: {
    title: 'OBJECTS OF DESIRE — A1 PAVILION',
    copy: 'The A1 Chic Living Pavilion captures Suofeiya in one room: kitchen, wardrobe and loose furniture, all designed and manufactured by one team.'
  },
  3: {
    title: 'KITCHEN CABINET — INDUSTRY 4.0',
    copy: 'Floor-to-ceiling kitchen joinery produced on Industry 4.0 lines across 8 manufacturing bases. Veneers selected and book-matched in the room itself.'
  },
  4: {
    title: 'LOOSE FURNITURE — SHARED LANGUAGE',
    copy: 'Sofas, tables and lounge programs that share the same Suofeiya joinery language as the built-in cabinetry. Made for the room, never adapted to it.'
  }
};

export default function ObjectsOfDesire() {
  const [active, setActive] = useState(2);

  // Hold the rail as a DLL — visual order survives reorderings without
  // re-binding event listeners.
  const dll = useMemo(() => DoublyLinkedList.from(objectsRail), []);
  void dll;

  return (
    <section className="objects">
      <h2 className="objects__title">
        OBJECTS <em style={{ fontStyle: 'italic' }}>of</em> DESIRE
      </h2>
      <div className="objects__rail" role="list">
        {objectsRail.map((src, i) => (
          <button
            key={src}
            role="listitem"
            type="button"
            className={`object${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
            data-cursor="select"
            aria-label={captions[i]?.title ?? 'Object'}
          >
            <Image src={src} alt="" fill sizes="280px" style={{ objectFit: 'cover' }} />
          </button>
        ))}
      </div>
      <div className="objects__caption">
        <h3>{captions[active]?.title}</h3>
        <p>{captions[active]?.copy}</p>
      </div>
    </section>
  );
}
