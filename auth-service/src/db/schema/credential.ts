import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./user.js";

export const credentials = pgTable('credentials',{
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar("email",{ length: 60 }).unique("credentials_email_unique").notNull(),
    password: text("password").notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
    createdAt: timestamp("created_at",{ withTimezone: true,mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at",{ withTimezone: true,mode: 'date' }).defaultNow().notNull(),

})