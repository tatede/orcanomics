import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/studentSession";

export default async function SettingsPage() {
  const session = await getStudentSession();
  if (!session) redirect("/login/student");
  return <div>Settings coming soon</div>;
}
