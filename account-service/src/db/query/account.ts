import { dbInstance } from "../db.js";
import { accounts } from "../schema/account.js";
import { and, eq, isNull, sql } from "drizzle-orm";
import { CreateAccountType } from "@/account/v1/schema/createAccount.js";


export class DbQuery {
    
    async findAccountByUserId(userId: string) {
         const existAccounts = await dbInstance.select({  
              id: accounts.id,
              accountName: accounts.accountName,
              accountNumber: accounts.accountNumber,
              accountType: accounts.accountType,
              accountStatus: accounts.accountStatus,
              balance: accounts.balance,
         })
                   .from(accounts)
                   .where(and(eq(accounts.userId,userId),isNull(accounts.closedAt)));
         return existAccounts;
    }

    async createAccount(userId: string,createInfo: CreateAccountType&{ accountNumber: string }) {
        
        const [createdAccount] = await dbInstance.insert(accounts)
                                                 .values({
                                                    userId,
                                                    accountName: createInfo.accountName,
                                                    accountType: createInfo.accountType,
                                                    accountNumber: createInfo.accountNumber
                                                 }).returning({
                                                    id: accounts.id,
                                                    accountName: accounts.accountName,
                                                    accountNumber: accounts.accountNumber,
                                                    accountType: accounts.accountType,
                                                    accountStatus: accounts.accountStatus,
                                                    balance: accounts.balance,
                                                 })
        return createdAccount;
    }

    async findAccountByNumber(accountNumber: string) {

        const [existAccount] = await dbInstance.select({  
              userId: accounts.userId,
              balance: accounts.balance
         })
                   .from(accounts)
                   .where(and(eq(accounts.accountNumber,accountNumber),isNull(accounts.closedAt)));
        return existAccount;
    }
    async deleteAccount(accountNumber: string) {
         
        const [result] = await dbInstance.update(accounts)
                        .set({
                            closedAt: new Date()
                        })
                        .where(eq(accounts.accountNumber,accountNumber))
                        .returning({
                            id: accounts.id,
                            accountName: accounts.accountName,
                            accountNumber: accounts.accountNumber,
                            accountType: accounts.accountType,
                            accountStatus: accounts.accountStatus,
                            balance: accounts.balance,
                        });
        return result;
    }

    async accountTransaction(accountNumber: string,amount: number) {
         
        const [result] = await dbInstance.update(accounts)
                        .set({
                            balance: sql`${accounts.balance} + ${amount}`
                        })
                        .where(eq(accounts.accountNumber,accountNumber))
                        .returning({
                            id: accounts.id,
                            accountName: accounts.accountName,
                            accountNumber: accounts.accountNumber,
                            accountType: accounts.accountType,
                            accountStatus: accounts.accountStatus,
                            balance: accounts.balance,
                        });
        return result;
    }
}