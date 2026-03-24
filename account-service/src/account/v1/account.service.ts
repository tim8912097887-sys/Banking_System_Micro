import { DbQuery } from "@/db/query/account.js";
import { CreateAccountType } from "./schema/createAccount.js";
import { generateNumber } from "@/utils/generateNumber.js";
import { logger } from "@/configs/logger.js";
import { NotFoundError } from "@/customs/error/httpErrors.js";
import { TransactionType } from "./schema/transaction.js";

type Event = {
   publishAccountCreate: (data: any) => Promise<void>
   publishAccountDelete: (data: any) => Promise<void>
}

export default class AccountService {
    

    constructor(
        private dbQuery: DbQuery,
        private event: Event
    ) {}

    async createAccount(userId: string,createInfo: CreateAccountType) {
        const accountNumber = generateNumber(createInfo.accountType);
        const createdAccount = await this.dbQuery.createAccount(userId,{ ...createInfo,accountNumber });
        await this.event.publishAccountCreate({
            key: userId,
            value: createdAccount
        });
        return createdAccount;
    }

    async getAccounts(userId: string) {
        const accounts = await this.dbQuery.findAccountByUserId(userId);
        return accounts;
    }

    async deleteAccount(userId: string,accountNumber: string) {
        
        const existAccount = await this.dbQuery.findAccountByNumber(accountNumber);
        if(!existAccount) {
            logger.warn(`User with id ${userId} try to delete account with accountNumber ${accountNumber} that is not exist`);
            throw new NotFoundError("Account not exist");
        }

        if(existAccount.userId !== userId) {
            logger.warn(`User with id ${userId} try to delete account with accountNumber ${accountNumber} that has no permission`);
            throw new NotFoundError("Account not exist");
        }

        const deletedUser = await this.dbQuery.deleteAccount(accountNumber);
        await this.event.publishAccountDelete({
            key: userId,
            value: deletedUser
        })
        return;
    }

    async internalTransaction(userId: string,transactionInfo: TransactionType) {
        
        const existAccount = await this.dbQuery.findAccountByNumber(transactionInfo.accountNumber);
        if(!existAccount) {
            logger.warn(`User with id ${userId} try to ${transactionInfo.type} money with accountNumber ${transactionInfo.accountNumber} that is not exist`);
            throw new NotFoundError("Account not exist");
        }

        if(existAccount.userId !== userId) {
            logger.warn(`User with id ${userId} try to ${transactionInfo.type} money with accountNumber ${transactionInfo.accountNumber} that has no permission`);
            throw new NotFoundError("Account not exist");
        }
   
        const amount = transactionInfo.type==="credit"?transactionInfo.amount:(Number(existAccount.balance)<transactionInfo.amount)?-Number(existAccount.balance):-transactionInfo.amount;
        const result = await this.dbQuery.accountTransaction(transactionInfo.accountNumber,amount);
        return result;
    }

}