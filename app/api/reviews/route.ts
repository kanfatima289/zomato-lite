import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  let body: {
    restaurantId?: unknown;
    rating?: unknown;
    comment?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const { rating, comment, restaurantId } = body;

  // Check 1: rating must be a whole number from 1 to 5.
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      { error: "Rating must be a whole number from 1 to 5." },
      { status: 400 }
    );
  }

  // Check 2: comment must be non-empty after trimming whitespace around it.
  if (typeof comment !== "string" || comment.trim().length === 0) {
    return NextResponse.json(
      { error: "Comment must not be empty." },
      { status: 400 }
    );
  }

  // Check 3: the restaurant must actually exist in the database.
  if (!Number.isInteger(restaurantId)) {
    return NextResponse.json(
      { error: "restaurantId must be a number." },
      { status: 400 }
    );
  }
  const restaurantRows = await sql.query(
    "SELECT id FROM restaurants WHERE id = $1",
    [restaurantId]
  );
  if (restaurantRows.length === 0) {
    return NextResponse.json(
      { error: "That restaurant does not exist." },
      { status: 400 }
    );
  }

  // All checks passed: insert exactly one row and nothing else.
  const inserted = await sql.query(
    "INSERT INTO reviews (restaurant_id, rating, comment) VALUES ($1, $2, $3) RETURNING id",
    [restaurantId, rating, comment.trim()]
  );

  return NextResponse.json(
    { success: true, reviewId: inserted[0].id },
    { status: 201 }
  );
}