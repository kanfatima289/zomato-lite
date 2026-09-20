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

function ratingFill(score: number | null): string {
  if (score === null) return "bg-rating-grey";
  if (score >= 4) return "bg-rating-green";
  if (score >= 3) return "bg-rating-amber";
  return "bg-rating-red";
}

function RatingPill({ score, size }: { score: number | null; size: "lg" | "sm" }) {
  const big = size === "lg";
  return (
    <span
      className={`${ratingFill(score)} inline-flex items-center gap-2 rounded-lg text-white ${
        big ? "px-5 py-3" : "px-2.5 py-1"
      }`}
    >
      <span className={big ? "text-2xl" : "text-xs"}>{"\u2605"}</span>
      <span
        className={`tabular-nums ${big ? "text-4xl font-bold" : "text-sm font-semibold"}`}
      >
        {score === null ? "—" : score}
      </span>
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
    <main className="mx-auto max-w-[560px] px-6 pb-16 pt-8">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-zred">Restaurant</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{name}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600">{cuisine}</span>
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600">{area}</span>
        </div>
      </header>

      <section className="mb-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <RatingPill score={averageRating} size="lg" />
          <div>
            <p className="text-base font-semibold">
              {totalReviews === 0 ? "Not yet rated" : `${totalReviews} ${totalReviews === 1 ? "review" : "reviews"}`}
            </p>
            <p className="text-xs text-neutral-500">Overall rating</p>
          </div>
        </div>
      </section>

      {totalReviews === 0 && (
        <section className="mb-8 rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
          <p className="font-medium">No reviews yet.</p>
          <p className="mt-1 text-sm text-neutral-500">Be the first to try {name}.</p>
        </section>
      )}

      {latestReview && (
        <section className="mb-8 rounded-2xl border border-neutral-200 border-l-4 border-l-zred bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-zred">Latest review</p>
            <p className="text-xs text-neutral-500">{formatDate(latestReview.createdAt)}</p>
          </div>
          <RatingPill score={latestReview.rating} size="sm" />
          <p className="mt-3 text-[15px] leading-relaxed">{latestReview.comment}</p>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="mb-8 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white px-6 shadow-sm">
          {reviews.map((review) => (
            <article key={review.id} className="py-5">
              <div className="flex items-center justify-between">
                <RatingPill score={review.rating} size="sm" />
                <p className="text-xs text-neutral-500">{formatDate(review.createdAt)}</p>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed">{review.comment}</p>
            </article>
          ))}
        </section>
      )}

      <nav className="mt-12">
        <Link
          href={`/review/${id}`}
          className="block rounded-full bg-zred py-4 text-center text-sm font-semibold text-white transition-colors hover:bg-zred-dark"
        >
          Write a review
        </Link>
      </nav>
    </main>
  );
}