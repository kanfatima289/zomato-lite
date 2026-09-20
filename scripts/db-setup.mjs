import { readFile } from "node:fs/promises";
import { Client } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Run with: node --env-file=.env.local scripts/db-setup.mjs");
  process.exit(1);
}

const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
const seed = await readFile(new URL("../db/seed.sql", import.meta.url), "utf8");

const client = new Client(url);
await client.connect();
await client.query(schema);
await client.query(seed);

const { rows: restaurants } = await client.query("SELECT id, name, cuisine, area FROM restaurants");
const { rows: reviews } = await client.query("SELECT id, restaurant_id, rating, comment, created_at FROM reviews ORDER BY created_at");
console.log("restaurants:", restaurants);
console.log("reviews:", reviews);

await client.end();
console.log("\nSchema and seed applied.");