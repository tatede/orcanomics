import { auth } from "@/auth";
import { db } from "@/db";
import { teachers, classes, students } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _req: Request,
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

  await db.delete(students).where(eq(students.id, id));
  return Response.json({ ok: true });
}
