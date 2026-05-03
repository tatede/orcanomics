import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/studentSession";
import StudentAccount from "@/components/StudentAccount";

export default async function StudentAccountPage() {
  const session = await getStudentSession();
  if (!session) redirect("/login/student");

  return (
    <StudentAccount
      student={session.student}
      className={session.class?.name ?? "My Class"}
    />
  );
}
