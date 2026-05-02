import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return Response.json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    console.error("[health] DB check failed:", err);
    return Response.json({ ok: false }, { status: 503 });
  }
}
