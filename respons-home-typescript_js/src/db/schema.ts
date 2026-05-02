import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

// ── Users ──────────────────────────────────────────────────────────────────
// Starter table – extend or add more tables below as the app grows.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
