'use client';

import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const LABELS = {
  de: { on: 'Ton ausschalten', off: 'Ton einschalten' },
  en: { on: 'Mute', off: 'Unmute' },
};

function IconOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <path d="m22 9-6 6M16 9l6 6" />
    </svg>
  );
}

function IconOn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

/**
 * Phone-framed looping video with a sound toggle — mirrors the design's
 * `.phone` mock-up. Autoplays muted; the button unmutes and (re)starts playback.
 */
export default function PhoneVideo({ src, poster, label }: { src: string; poster?: string; label?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const pathname = usePathname();
  const t = pathname === '/en' || pathname.startsWith('/en/') ? LABELS.en : LABELS.de;

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !soundOn;
    v.muted = !next;
    setSoundOn(next);
    if (next) {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  };

  return (
    <div className="phone rv" style={{ transitionDelay: '.15s' }}>
      <span className="phone-btn phone-btn-a" aria-hidden="true" />
      <span className="phone-btn phone-btn-b" aria-hidden="true" />
      <span className="phone-btn phone-btn-c" aria-hidden="true" />
      <div className="phone-screen">
        <video
          ref={videoRef}
          className="phone-video"
          src={src}
          poster={poster || undefined}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-label={label || undefined}
        />
        <span className="phone-island" aria-hidden="true" />
        <button
          className="phone-sound"
          type="button"
          onClick={toggle}
          aria-pressed={soundOn}
          aria-label={soundOn ? t.on : t.off}
        >
          {soundOn ? <IconOn /> : <IconOff />}
        </button>
      </div>
    </div>
  );
}
