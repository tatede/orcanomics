import { db } from "@/db";
import { sql } from "drizzle-orm";
import { auth } from "@/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return Response.json({ error: "Topic is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const studentId = cookieStore.get("student_id")?.value ?? null;

    const session = await auth();
    const teacherEmail = session?.user?.email ?? null;

    if (!studentId && !teacherEmail) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const result = await db.execute(
      sql`INSERT INTO support_tickets (topic, student_id, teacher_email) 
          VALUES (${topic}, ${studentId}, ${teacherEmail}) 
          RETURNING id`
    );

    return Response.json({ id: result.rows[0].id });
  } catch (e) {
    console.error("POST /api/support/tickets error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const teacherEmail = searchParams.get("teacherEmail");

    if (studentId) {
      const result = await db.execute(
        sql`SELECT * FROM support_tickets WHERE student_id = ${studentId} ORDER BY created_at DESC`
      );
      return Response.json(result.rows ?? []);
    }

    if (teacherEmail) {
      const result = await db.execute(
        sql`SELECT * FROM support_tickets WHERE teacher_email = ${teacherEmail} ORDER BY created_at DESC`
      );
      return Response.json(result.rows ?? []);
    }

    return Response.json([]);
  } catch (e) {
    console.error("GET /api/support/tickets error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
