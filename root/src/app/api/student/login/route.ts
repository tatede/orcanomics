import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.username, username));

  if (!student) {
    return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
  }

  const validHash = await bcrypt.compare(password, student.passwordHash);
  const validPlain = password === student.password;

  if (!validHash && !validPlain) {
    return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  
  response.cookies.set("student_id", student.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
