import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/studentSession";
import StudentDashboard from "@/components/StudentDashboard";

export default async function StudentDashboardPage() {
  const session = await getStudentSession();
  if (!session) redirect("/login/student");

  return (
    <StudentDashboard
      student={session.student}
      className={session.class?.name ?? "My Class"}
    />
  );
}
