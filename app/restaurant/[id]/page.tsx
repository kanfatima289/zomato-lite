"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

type RestaurantData = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

function Stars({ count }: { count: number }) {
  return (
    <span className="tracking-wider">
      <span className="text-accent">{"\u2605".repeat(count)}</span>
      <span className="text-neutral-300">{"\u2605".repeat(5 - count)}</span>
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

export default function RestaurantPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<RestaurantData | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "missing" | "error">("loading");

  useEffect(() => {
    fetch(`/api/restaurants/${id}`)
      .then(async (res) => {
        if (res.status === 404) return setStatus("missing");
        if (!res.ok) return setStatus("error");
        setData(await res.json());
        return setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  if (status === "loading") {
    return <main className="mx-auto max-w-[560px] px-6 py-16 text-center text-neutral-500">Loading…</main>;
  }
  if (status === "missing") {
    return <main className="mx-auto max-w-[560px] px-6 py-16"><p>Restaurant not found.</p></main>;
  }
  if (status === "error" || !data) {
    return <main className="mx-auto max-w-[560px] px-6 py-16"><p>Something went wrong. Please try again.</p></main>;
  }

  const { name, cuisine, area, averageRating, totalReviews, latestReview, reviews } = data;

  return (
    <main className="mx-auto max-w-[560px] px-6 py-16">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
        <p className="mt-1 text-sm text-neutral-500">{cuisine} · {area}</p>
      </header>

      <section className="mb-12">
        <p className="text-7xl font-semibold tracking-tight">{averageRating === null ? "—" : averageRating}</p>
        <p className="mt-2 text-sm text-neutral-500">
          {totalReviews === 0 ? "No reviews yet" : `${totalReviews} ${totalReviews === 1 ? "review" : "reviews"}`}
        </p>
      </section>

      {totalReviews === 0 && (
        <section className="mb-12 rounded-xl border border-neutral-200 p-8 text-center">
          <p className="text-neutral-600">No reviews yet. Be the first to try {name}.</p>
        </section>
      )}

      {latestReview && (
        <section className="mb-12 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <p className="mb-3 text-xs uppercase tracking-wide text-neutral-500">Latest review</p>
          <Stars count={latestReview.rating} />
          <p className="mt-3">{latestReview.comment}</p>
          <p className="mt-2 text-xs text-neutral-500">{formatDate(latestReview.createdAt)}</p>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="space-y-8">
          {reviews.map((review) => (
            <article key={review.id}>
              <Stars count={review.rating} />
              <p className="mt-2">{review.comment}</p>
              <p className="mt-1 text-xs text-neutral-500">{formatDate(review.createdAt)}</p>
            </article>
          ))}
        </section>
      )}

      <nav className="mt-12">
        <Link
          href={`/review/${id}`}
          className="inline-block rounded-lg bg-foreground px-5 py-3 text-sm text-background"
        >
          Write a review
        </Link>
      </nav>
    </main>
  );
}