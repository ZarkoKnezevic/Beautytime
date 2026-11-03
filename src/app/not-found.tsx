import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-sand px-6 text-center">
      <p className="cap mb-6">Fehler 404</p>
      <h1 className="disp mb-8">
        Seite nicht <em className="it text-gold">gefunden.</em>
      </h1>
      <Link href="/" className="ul text-sm">
        Zur Startseite
      </Link>
    </main>
  );
}
