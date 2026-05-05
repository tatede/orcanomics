import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticketId = searchParams.get("ticketId");
  if (!ticketId) return Response.json([]);
  const result = await db.execute(
    sql`SELECT * FROM support_messages WHERE ticket_id = ${ticketId} ORDER BY created_at ASC`
  );
  return Response.json(result.rows);
}

export async function POST(req: Request) {
  const { ticketId, sender, message } = await req.json();
  await db.execute(
    sql`INSERT INTO support_messages (ticket_id, sender, message) VALUES (${ticketId}, ${sender}, ${message})`
  );
  return Response.json({ ok: true });
}
