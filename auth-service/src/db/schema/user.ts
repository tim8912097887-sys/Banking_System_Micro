import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users',{
    id: uuid('id').defaultRandom().primaryKey(),
    firstName: varchar("first_name",{ length: 50 }).notNull(),
    lastName: varchar("last_name",{ length: 50 }).notNull(),
    email: varchar("email",{ length: 60 }).unique("users_email_unique").notNull(),
    createdAt: timestamp("created_at",{ withTimezone: true,mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at",{ withTimezone: true,mode: 'date' }).defaultNow().notNull(),
})