import { auth } from "@/auth";
import { cookies } from "next/headers";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { students, teachers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { topic } = await req.json();

  const cookieStore = await cookies();
  const studentId = cookieStore.get("student_id")?.value ?? null;

  const session = await auth();
  const teacherEmail = session?.user?.email ?? null;

  let name = "";
  let email = "";

  if (studentId) {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId));
    if (student) {
      name = student.displayName || student.username || "";
    }
  } else if (teacherEmail) {
    const [teacher] = await db
      .select()
      .from(teachers)
      .where(eq(teachers.email, teacherEmail));
    if (teacher) {
      name = teacher.name || "";
      email = teacher.email || "";
    }
  }

  const result = await db.execute(
    sql`INSERT INTO support_tickets (name, email, topic, student_id, teacher_email) 
        VALUES (${name}, ${email}, ${topic}, ${studentId}, ${teacherEmail}) 
        RETURNING id`
  );

  return Response.json({ id: result.rows[0].id });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const teacherEmail = searchParams.get("teacherEmail");

  if (studentId) {
    const result = await db.execute(
      sql`SELECT * FROM support_tickets WHERE student_id = ${studentId} ORDER BY created_at DESC`
    );
    return Response.json(result.rows);
  }

  if (teacherEmail) {
    const result = await db.execute(
      sql`SELECT * FROM support_tickets WHERE teacher_email = ${teacherEmail} ORDER BY created_at DESC`
    );
    return Response.json(result.rows);
  }

  return Response.json([]);
}
