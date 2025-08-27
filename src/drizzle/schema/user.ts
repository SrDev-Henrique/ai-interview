import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { JobInfoTable } from "./jobinfo";
import { relations } from "drizzle-orm/relations";

export const UsersTable = pgTable("users", {
  id: varchar().primaryKey(),
  name: varchar().notNull(),
  email: varchar().notNull().unique(),
  imageUrl: varchar().notNull(),
  createdAt,
  updatedAt,
});

export const UserRelations = relations(UsersTable, ({ many }) => ({
  jobInfos: many(JobInfoTable),
}));
