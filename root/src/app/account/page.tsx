import { auth } from "@/auth";
import { db } from "@/db";
import { teachers, classes, students } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import TeacherDashboard from "@/components/TeacherDashboard";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const [teacher] = await db
    .select()
    .from(teachers)
    .where(eq(teachers.email, session.user.email));

  if (!teacher) redirect("/login");

  const teacherClasses = await db
    .select()
    .from(classes)
    .where(eq(classes.teacherId, teacher.id));

  const classIds = teacherClasses.map((c) => c.id);

  const teacherStudents = classIds.length > 0
    ? await db
        .select()
        .from(students)
        .where(inArray(students.classId, classIds))
    : [];

  return (
    <TeacherDashboard
      teacher={teacher}
      classes={teacherClasses}
      students={teacherStudents}
    />
  );
}
