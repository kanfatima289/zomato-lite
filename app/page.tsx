"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type RestaurantData = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
};

function ratingFill(score: number): string {
  if (score >= 4) return "bg-rating-green";
  if (score >= 3) return "bg-rating-amber";
  return "bg-rating-red";
}

export default function Home() {
  const [data, setData] = useState<RestaurantData | null>(null);

  useEffect(() => {
    fetch("/api/restaurants/1")
      .then(async (res) => {
        if (res.ok) setData(await res.json());
      })
      .catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-[560px] px-6 pt-10 pb-4">
      <div className="relative h-56 overflow-hidden rounded-3xl shadow-sm sm:h-64">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"
          alt="Plate of Indian food"
          fill
          priority
          sizes="(max-width: 560px) 100vw, 560px"
          className="object-cover"
        />
      </div>

      <div className="pt-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{data?.name ?? "Ludhiana Burrito"}</h1>
        <p className="mt-2 text-sm text-neutral-500">
          {data ? `${data.cuisine} · ${data.area}` : "Indian · Sector 32"}
        </p>

        <div className="mt-5 flex items-center justify-center gap-2 text-sm">
          {data && data.averageRating !== null ? (
            <>
              <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold text-white ${ratingFill(data.averageRating)}`}>
                <span className="text-xs">{"\u2605"}</span>
                <span className="tabular-nums">{data.averageRating}</span>
              </span>
              <span className="text-neutral-500">
                {data.totalReviews} {data.totalReviews === 1 ? "review" : "reviews"}
              </span>
            </>
          ) : (
            <span className="text-neutral-400">Loading the latest ratings…</span>
          )}
        </div>

        <div className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-3">
          <Link
            href="/restaurant/1"
            className="rounded-full bg-zred py-4 text-sm font-semibold text-white transition-colors hover:bg-zred-dark"
          >
            See the restaurant
          </Link>
          <Link
            href="/review/1"
            className="rounded-full border border-neutral-300 py-4 text-sm font-semibold text-foreground transition-colors hover:border-zred hover:text-zred"
          >
            Write a review
          </Link>
        </div>
      </div>
    </main>
  );
}