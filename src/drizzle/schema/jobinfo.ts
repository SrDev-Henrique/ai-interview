import { pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { UsersTable } from "./user";
import { relations } from "drizzle-orm/relations";
import { QuestionTable } from "./question";
import { InterviewTable } from "./interview";

export const experienceLevels = ["Junior", "Pleno", "Senior"] as const;

export type ExperienceLevel = (typeof experienceLevels)[number];

export const experienceLevelEnum = pgEnum("job_info_experience_level", experienceLevels);

export const JobInfoTable = pgTable("job_info", {
  id,
  title: varchar(),
  name: varchar().notNull(),
  experienceLevel: experienceLevelEnum().notNull(),
  description: varchar().notNull(),
  userId: varchar()
    .references(() => UsersTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt,
  updatedAt,
});

export const JobInfoRelations = relations(JobInfoTable, ({ one, many }) => ({
  user: one(UsersTable, {
    fields: [JobInfoTable.userId],
    references: [UsersTable.id],
  }),
  questions: many(QuestionTable),
  interviews: many(InterviewTable),
}));
