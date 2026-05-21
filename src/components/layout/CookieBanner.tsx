'use client';

import { useEffect, useState } from 'react';

const KEY = 'suofeiya:cookie';

type Pref = { necessary: boolean; preferences: boolean; marketing: boolean; unclassified: boolean };

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<'consent' | 'manage' | 'details'>('consent');
  const [pref, setPref] = useState<Pref>({ necessary: true, preferences: false, marketing: false, unclassified: false });

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null;
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(t);
    }
  }, []);

  const persist = (data: Pref) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ data, savedAt: Date.now() }));
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <aside className={`cookie-banner${visible ? ' is-visible' : ''}`} aria-hidden={!visible}>
      <div className="cookie-banner__tabs">
        <button type="button" className={active === 'consent' ? 'is-active' : ''} onClick={() => setActive('consent')}>
          Consent
        </button>
        <button type="button" className={active === 'manage' ? 'is-active' : ''} onClick={() => setActive('manage')}>
          Manage cookie preferences
        </button>
        <button type="button" className={active === 'details' ? 'is-active' : ''} onClick={() => setActive('details')}>
          Details
        </button>
      </div>

      {active === 'consent' && (
        <p>
          We use cookies to personalise content, provide social features and analyse our traffic. We also share information about
          your use of our site with our analytics partners who may combine it with other information.
        </p>
      )}

      {active === 'manage' && (
        <ul className="cookie-banner__checks">
          {(['necessary', 'preferences', 'marketing', 'unclassified'] as const).map((k) => (
            <li key={k}>
              <input
                type="checkbox"
                checked={pref[k]}
                disabled={k === 'necessary'}
                onChange={(e) => setPref((p) => ({ ...p, [k]: e.target.checked }))}
              />
              {k}
            </li>
          ))}
        </ul>
      )}

      {active === 'details' && (
        <p>
          Necessary cookies enable core functions like security and accessibility. Preferences remember your theme and language.
          Marketing helps us understand which projects resonate. Unclassified are pending review.
        </p>
      )}

      <div className="cookie-banner__actions">
        <button
          type="button"
          className="link-underline"
          onClick={() => persist({ necessary: true, preferences: true, marketing: true, unclassified: true })}
        >
          Allow all
        </button>
        <button type="button" className="link-underline" onClick={() => persist(pref)}>
          Allow selection
        </button>
        <button type="button" className="link-underline" onClick={() => persist({ necessary: true, preferences: false, marketing: false, unclassified: false })}>
          Deny
        </button>
      </div>
    </aside>
  );
}
