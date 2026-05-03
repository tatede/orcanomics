import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function POST(req: Request) {
  const { message, secret } = await req.json();
  if (secret !== process.env.ADMIN_SECRET) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  await db.execute(sql`UPDATE messages SET active = false`);
  if (message) {
    await db.execute(
      sql`INSERT INTO messages (content, active) VALUES (${message}, true)`
    );
  }
  return Response.json({ ok: true });
}

export async function GET() {
  const rows = await db.execute(
    sql`SELECT content FROM messages WHERE active = true LIMIT 1`
  );
  const content = rows.rows[0]?.content ?? null;
  return Response.json({ message: content });
}
