import { auth } from "@/auth";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function POST(req: Request) {
  const { topic } = await req.json();

  const cookieStore = await cookies();
  const studentId = cookieStore.get("student_id")?.value ?? null;

  const session = await auth();
  const teacherEmail = session?.user?.email ?? null;

  // Resolve name/email from DB — don't trust the client to send it
  let name = "";
  let email = "";

  if (studentId) {
    const result = await pool.query(
      `SELECT username, display_name FROM students WHERE id = $1`,
      [studentId]
    );
    const student = result.rows[0];
    if (student) {
      name = student.display_name || student.username || "";
    }
  } else if (teacherEmail) {
    const result = await pool.query(
      `SELECT name, email FROM teachers WHERE email = $1`,
      [teacherEmail]
    );
    const teacher = result.rows[0];
    if (teacher) {
      name = teacher.name || "";
      email = teacher.email || "";
    }
  }

  const result = await pool.query(
    `INSERT INTO support_tickets (name, email, topic, student_id, teacher_email) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id`,
    [name, email, topic, studentId, teacherEmail]
  );

  return Response.json({ id: result.rows[0].id });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const teacherEmail = searchParams.get("teacherEmail");

  if (studentId) {
    const result = await pool.query(
      `SELECT * FROM support_tickets WHERE student_id = $1 ORDER BY created_at DESC`,
      [studentId]
    );
    return Response.json(result.rows);
  }

  if (teacherEmail) {
    const result = await pool.query(
      `SELECT * FROM support_tickets WHERE teacher_email = $1 ORDER BY created_at DESC`,
      [teacherEmail]
    );
    return Response.json(result.rows);
  }

  return Response.json([]);
}
