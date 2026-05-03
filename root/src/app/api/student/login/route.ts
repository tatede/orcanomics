import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.username, username));

  if (!student) {
    return new Response(JSON.stringify({ message: "Invalid" }), { status: 401 });
  }

  const validHash = await bcrypt.compare(password, student.passwordHash);
  const validPlain = password === student.password;

  if (!validHash && !validPlain) {
    return new Response(JSON.stringify({ message: "Invalid" }), { status: 401 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `student_id=${student.id}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}
