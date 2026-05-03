import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/studentSession";

export default async function PracticePage() {
  const session = await getStudentSession();
  if (!session) redirect("/login/student");
  return <div>Practice coming soon</div>;
}
