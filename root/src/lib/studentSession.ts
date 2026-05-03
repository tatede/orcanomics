import { cookies } from "next/headers";
import { db } from "@/db";
import { students, classes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getStudentSession() {
  const cookieStore = await cookies();
  const studentId = cookieStore.get("student_id")?.value;
  if (!studentId) return null;

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId));

  if (!student) return null;

  const [cls] = await db
    .select()
    .from(classes)
    .where(eq(classes.id, student.classId));

  return { student, class: cls };
}
