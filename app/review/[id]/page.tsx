"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    <main className="mx-auto max-w-[560px] px-6 py-16">
      <header className="mb-12">
        <p className="text-sm text-neutral-500">Reviewing</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{name}</h1>
      </header>

      <div className="mb-8">
        <p className="mb-3 text-sm text-neutral-600">Your rating</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => {
            const selected = rating !== null && value <= rating;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                className={`text-4xl leading-none transition-colors ${selected ? "text-zred" : "text-neutral-300"}`}
              >
                {"\u2605"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <label htmlFor="comment" className="mb-3 block text-sm text-neutral-600">Your review</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="How was the food?"
          className="w-full resize-none rounded-lg border border-neutral-300 bg-white p-3 text-sm outline-none focus:border-zred"
        />
      </div>

      {error && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-zred">{error}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={rating === null || comment.trim().length === 0 || submitting}
        className="rounded-lg bg-zred px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zred-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? "Submitting…" : "Submit review"}
      </button>

      <nav className="mt-12">
        <Link href={`/restaurant/${id}`} className="text-sm text-zred underline-offset-4 hover:underline">
          Never mind — back to the restaurant
        </Link>
      </nav>
    </main>
  );
}