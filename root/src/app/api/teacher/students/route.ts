import { auth } from "@/auth";
import { db } from "@/db";
import { teachers, classes, students } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const [teacher] = await db.select().from(teachers).where(eq(teachers.email, session.user.email));
  if (!teacher) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { username, password, classId } = await req.json();

  const [cls] = await db.select().from(classes).where(eq(classes.id, classId));
  if (!cls || cls.teacherId !== teacher.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await db.insert(students).values({ username, password, passwordHash, classId });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ message: "Username already taken" }, { status: 400 });
  }
}
