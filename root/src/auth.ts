import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@/db";
import { teachers } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const existing = await db
        .select()
        .from(teachers)
        .where(eq(teachers.email, user.email));
      if (existing.length === 0) {
        await db.insert(teachers).values({
          email: user.email,
          name: user.name ?? "",
        });
      }
      return true;
    },
  },
});
