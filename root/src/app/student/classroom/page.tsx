import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/studentSession";
import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import StudentClassroom from "@/components/StudentClassroom";

export default async function StudentClassroomPage() {
  const session = await getStudentSession();
  if (!session) redirect("/login/student");

  const classmates = await db
    .select()
    .from(students)
    .where(eq(students.classId, session.student.classId));

  return (
    <StudentClassroom
      currentStudent={session.student}
      classmates={classmates}
      className={session.class?.name ?? "My Class"}
    />
  );
}
