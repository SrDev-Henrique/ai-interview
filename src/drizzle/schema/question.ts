import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm/relations";
import { JobInfoTable } from "./jobinfo";

export const questionDifficultyLevel = ["Fácil", "Médio", "Difícil"] as const;

export type QuestionDifficultyLevel = (typeof questionDifficultyLevel)[number];

export const questionDifficultyLevelEnum = pgEnum(
  "question_difficulty_level",
  questionDifficultyLevel,
);

export const QuestionTable = pgTable("questions", {
  id,
  difficultyLevel: questionDifficultyLevelEnum().notNull(),
  jobInfoId: uuid()
    .references(() => JobInfoTable.id, { onDelete: "cascade" })
    .notNull(),
  text: varchar().notNull(),
  createdAt,
  updatedAt,
});

export const QuestionRelations = relations(QuestionTable, ({ one }) => ({
  jobInfo: one(JobInfoTable, {
    fields: [QuestionTable.jobInfoId],
    references: [JobInfoTable.id],
  }),
}));
