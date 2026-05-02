import { auth } from "@/auth";
import { db } from "@/db";
import { teachers, classes, students } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.email) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const [teacher] = await db.select().from(teachers).where(eq(teachers.email, session.user.email));
  if (!teacher) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const [student] = await db.select().from(students).where(eq(students.id, id));
  if (!student) return Response.json({ message: "Not found" }, { status: 404 });

  const [cls] = await db.select().from(classes).where(eq(classes.id, student.classId));
  if (!cls || cls.teacherId !== teacher.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { newPassword } = await req.json();
  if (!newPassword || newPassword.length < 4) {
    return Response.json({ message: "Password too short" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.update(students)
    .set({ password: newPassword, passwordHash })
    .where(eq(students.id, id));

  return Response.json({ ok: true });
}
