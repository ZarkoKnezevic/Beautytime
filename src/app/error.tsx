'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-sand px-6 text-center">
      <p className="cap mb-6">Ein Fehler ist aufgetreten</p>
      <h1 className="h2 mb-8">
        Etwas ist <em className="it text-gold">schiefgelaufen.</em>
      </h1>
      <button type="button" onClick={reset} className="btn">
        <span>Erneut versuchen</span>
      </button>
    </main>
  );
}
