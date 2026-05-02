import { auth } from "@/auth";
import { db } from "@/db";
import { teachers, classes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const [teacher] = await db.select().from(teachers).where(eq(teachers.email, session.user.email));
  if (!teacher) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  await db.insert(classes).values({ name, teacherId: teacher.id });
  return Response.json({ ok: true });
}
