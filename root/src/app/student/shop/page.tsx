import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/studentSession";

export default async function ShopPage() {
  const session = await getStudentSession();
  if (!session) redirect("/login/student");
  return <div>Shop coming soon</div>;
}
