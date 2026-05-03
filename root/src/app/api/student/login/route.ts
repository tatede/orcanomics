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
    return Response.json({ message: "Invalid username or password" }, { status: 401 });
  }

  const validHash = await bcrypt.compare(password, student.passwordHash);
  const validPlain = password === student.password;

  if (!validHash && !validPlain) {
    return Response.json({ message: "Invalid username or password" }, { status: 401 });
  }

  const response = Response.json({ ok: true });
  
  const cookieValue = `student_id=${student.id}; Path=/; Max-Age=${60 * 60 * 24 * 30}; HttpOnly; SameSite=Lax`;
  
  response.headers.set("Set-Cookie", cookieValue);
  
  return response;
}