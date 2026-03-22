import { decimal, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const AccountTypeEnum = pgEnum('accountType',['current','savings']);
export const AccountStatusEnum = pgEnum('accountStatus',['active','frozen','closed']);

export const accounts = pgTable('accounts',{
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    accountName: text('account_name').notNull(),
    accountType: AccountTypeEnum('account_type').notNull().default(AccountTypeEnum.enumValues[1]),
    accountNumber: varchar('account_number',{ length: 15}),
    accountStatus: AccountStatusEnum('account_status').notNull().default(AccountStatusEnum.enumValues[0]),
    balance: decimal("balance", { precision: 10, scale: 2 }).default("0").notNull(),
    currency: varchar('currency',{ length: 3 }).default('TWD').notNull(),
    createdAt: timestamp("created_at",{ withTimezone: true,mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at",{ withTimezone: true,mode: 'date' }).defaultNow().notNull(),
    closedAt: timestamp("closed_at",{ withTimezone: true,mode: 'date' }),
})