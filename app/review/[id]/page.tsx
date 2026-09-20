"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ratingWords = ["Terrible", "Poor", "Average", "Good", "Excellent"];

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [name, setName] = useState<string | null>(null);
  const [nameStatus, setNameStatus] = useState<"loading" | "ok" | "missing">("loading");
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/restaurants/${id}`)
      .then(async (res) => {
        if (!res.ok) return setNameStatus("missing");
        const data = await res.json();
        setName(data.name);
        setNameStatus("ok");
      })
      .catch(() => setNameStatus("missing"));
  }, [id]);

  async function handleSubmit() {
    if (rating === null || comment.trim().length === 0 || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId: Number(id), rating, comment }),
      });
      if (res.status === 201) {
        router.push(`/restaurant/${id}`);
        return;
      }
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (nameStatus === "loading") {
    return <main className="mx-auto max-w-[560px] px-6 py-16 text-center text-neutral-500">Loading…</main>;
  }
  if (nameStatus === "missing") {
    return <main className="mx-auto max-w-[560px] px-6 py-16"><p>Restaurant not found.</p></main>;
  }

  return (
    <main className="mx-auto max-w-[560px] px-6 pb-14 pt-8">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-zred">Reviewing</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{name}</h1>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <div className="mb-3 flex items-baseline justify-between">
          <label className="text-sm font-semibold">Your rating</label>
          {rating !== null && (
            <span className="rounded-full bg-zred px-2.5 py-0.5 text-xs font-semibold text-white">{ratingWords[rating - 1]}</span>
          )}
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => {
            const selected = rating !== null && value <= rating;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                className={`text-5xl leading-none transition-colors hover:text-zred ${selected ? "text-zred" : "text-neutral-300"}`}
              >
                {"\u2605"}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <label htmlFor="comment" className="mb-3 block text-sm font-semibold">Your review</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            placeholder="How was the food?"
            className="w-full resize-none rounded-xl border border-neutral-300 bg-white p-3.5 text-sm outline-none focus:border-zred"
          />
        </div>

        {error && (
          <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-zred">{error}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={rating === null || comment.trim().length === 0 || submitting}
          className="mt-8 block w-full rounded-full bg-zred py-4 text-sm font-semibold text-white transition-colors hover:bg-zred-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Submitting…" : "Submit review"}
        </button>
      </section>

      <nav className="mt-8 text-center">
        <Link href={`/restaurant/${id}`} className="text-sm text-zred underline-offset-4 hover:underline">
          Never mind — back to the restaurant
        </Link>
      </nav>
    </main>
  );
}