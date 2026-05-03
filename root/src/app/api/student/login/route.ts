import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      return NextResponse.redirect(new URL("/login/student?error=missing", req.url));
    }

    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.username, username));

    if (!student) {
      return NextResponse.redirect(new URL("/login/student?error=invalid", req.url));
    }

    const validHash = await bcrypt.compare(password, student.passwordHash);
    const validPlain = password === student.password;

    if (!validHash && !validPlain) {
      return NextResponse.redirect(new URL("/login/student?error=invalid", req.url));
    }

    const response = NextResponse.redirect(new URL("/student/dashboard", req.url));

    response.cookies.set("student_id", student.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;

  } catch (err) {
    console.error(err);
    return NextResponse.redirect(new URL("/login/student?error=server", req.url));
  }
}
