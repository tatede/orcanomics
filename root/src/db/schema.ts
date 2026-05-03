import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from "drizzle-orm/pg-core";

export const teachers = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  badge: text("badge"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  teacherId: uuid("teacher_id").notNull().references(() => teachers.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  passwordHash: text("password_hash").notNull(),
  classId: uuid("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  coins: integer("coins").default(0),
  avatar: text("avatar"),
  inventory: text("inventory").array().default([]),
  isPremium: boolean("is_premium").default(false),
  lessonProgress: integer("lesson_progress").default(1),
  highScores: jsonb("high_scores").default({}),
  grade: text("grade").default("3"),
  createdAt: timestamp("created_at").defaultNow(),
});
