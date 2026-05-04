import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/studentSession";
import { cookies } from "next/headers";

export default async function StudentDashboardPage() {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get("student_id");
  console.log("RAW COOKIE ON DASHBOARD:", rawCookie);
  
  const session = await getStudentSession();
  console.log("SESSION:", session);
  
  if (!session) redirect("/login/student");
