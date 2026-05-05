import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function POST(req: Request) {
  const { name, email, topic } = await req.json();
  const result = await db.execute(
    sql`INSERT INTO support_tickets (name, email, topic) VALUES (${name}, ${email}, ${topic}) RETURNING id`
  );
  return Response.json({ id: result.rows[0].id });
}
