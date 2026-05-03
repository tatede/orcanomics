import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.username, username));

  if (!student) {
    return Response.json({ message: "Invalid username or password" }, { status: 401 });
  }

  // Check plain password OR hash
  const validHash = await bcrypt.compare(password, student.passwordHash);
  const validPlain = password === student.password;
  
  if (!validHash && !validPlain) {
    return Response.json({ message: "Invalid username or password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("student_id", student.id, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return Response.json({ ok: true });
}
