'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');

  return (
    <form
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        setState('sending');
        setTimeout(() => setState('sent'), 800);
      }}
    >
      <label>
        Name
        <input required name="name" autoComplete="name" />
      </label>
      <label>
        Email
        <input required type="email" name="email" autoComplete="email" />
      </label>
      <label>
        Project type
        <select name="type" defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          <option>Whole-house design</option>
          <option>Interior design</option>
          <option>Architecture</option>
          <option>Cabinetry & fit-out</option>
          <option>Procurement</option>
        </select>
      </label>
      <label>
        Message
        <textarea required name="message" />
      </label>
      <button type="submit" className="link-underline" disabled={state === 'sending'} data-cursor="send">
        {state === 'sent' ? 'Thank you — we will be in touch' : state === 'sending' ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
}
