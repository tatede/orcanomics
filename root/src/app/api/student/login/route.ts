import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ message: "Missing fields" }), {
        status: 400,
      });
    }

    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.username, username));

    if (!student) {
      return new Response(JSON.stringify({ message: "Invalid" }), {
        status: 401,
      });
    }

    // ✅ ONLY hashed password check (secure)
    const valid = await bcrypt.compare(password, student.passwordHash);

    if (!valid) {
      return new Response(JSON.stringify({ message: "Invalid" }), {
        status: 401,
      });
    }

    // ✅ Set cookie properly (works in dev + prod)
    const cookieStore = cookies();

    cookieStore.set("student_id", String(student.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 🔑 KEY FIX
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
