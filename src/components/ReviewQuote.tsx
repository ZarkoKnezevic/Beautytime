'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { Locale } from '@/utils';

const LABEL: Record<Locale, { more: string; less: string }> = {
  de: { more: 'Weiterlesen', less: 'Weniger anzeigen' },
  en: { more: 'Read more', less: 'Show less' },
};

/**
 * Review text clamped to a fixed number of lines so every card has the same
 * height; a "read more" toggle appears only when the text actually overflows.
 */
export default function ReviewQuote({ quote, locale }: { quote: string; locale: Locale }) {
  const ref = useRef<HTMLQuoteElement>(null);
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      if (!el.classList.contains('rq-open')) setOverflows(el.scrollHeight > el.clientHeight + 1);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const label = LABEL[locale] ?? LABEL.de;

  return (
    <>
      <blockquote ref={ref} className={`it rq${open ? ' rq-open' : ''}`}>
        {quote ? `„${quote}“` : ''}
      </blockquote>
      {/* Always rendered (hidden when the text fits) so every card keeps the same height. */}
      <button
        type="button"
        className="cap ul rq-btn"
        aria-expanded={open}
        aria-hidden={!(overflows || open) || undefined}
        tabIndex={overflows || open ? undefined : -1}
        style={overflows || open ? undefined : { visibility: 'hidden' }}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ul-t">{open ? label.less : label.more}</span>
      </button>
    </>
  );
}
