import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type Review = {
  id: number;
  rating: number;
  comment: string;
  created_at: string | Date;
};

function toReview(row: Review) {
  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const restaurantId = Number(id);

  // Facts about the restaurant itself.
  const restaurantRows = await sql.query(
    "SELECT name, cuisine, area FROM restaurants WHERE id = $1",
    [restaurantId]
  );
  if (restaurantRows.length === 0) {
    return NextResponse.json(
      { error: "Restaurant not found." },
      { status: 404 }
    );
  }
  const restaurant = restaurantRows[0];

  // Answers, computed fresh on every request. No stored averages anywhere.
  const agg = await sql.query(
    `SELECT
       ROUND(AVG(rating)::numeric, 1) AS average_rating,
       COUNT(*)::int AS total_reviews
     FROM reviews
     WHERE restaurant_id = $1`,
    [restaurantId]
  );

  const latest = await sql.query(
    `SELECT id, rating, comment, created_at
     FROM reviews
     WHERE restaurant_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [restaurantId]
  );

  const older = await sql.query(
    `SELECT id, rating, comment, created_at
     FROM reviews
     WHERE restaurant_id = $1
     ORDER BY created_at DESC
     OFFSET 1`,
    [restaurantId]
  );

  const average = agg[0].average_rating;
  const averageRating = average === null ? null : Number(average);
  const totalReviews = agg[0].total_reviews;

  return NextResponse.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating,
    totalReviews,
    latestReview: latest.length > 0 ? toReview(latest[0]) : null,
    reviews: older.map(toReview),
  });
}