import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-[560px] flex-col items-center justify-center px-6 py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-zred text-3xl font-bold text-white">z</span>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Ludhiana Burrito</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
        Indian · Sector 32 — rated honestly by the people who ate there.
      </p>

      <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
        <Link
          href="/restaurant/1"
          className="rounded-full bg-zred py-4 text-sm font-semibold text-white transition-colors hover:bg-zred-dark"
        >
          See the restaurant
        </Link>
        <Link
          href="/review/1"
          className="rounded-full border border-neutral-300 bg-white py-4 text-sm font-semibold text-foreground transition-colors hover:border-zred hover:text-zred"
        >
          Write a review
        </Link>
      </div>

      <p className="mt-12 text-xs text-neutral-400">Two screens · two APIs · one database</p>
    </main>
  );
}