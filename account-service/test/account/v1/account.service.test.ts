import { jest } from '@jest/globals';
import { DbQuery } from "@/db/query/account.js";
import { createAccountMock } from 'test/utils/account.utils.js';
import { randomUUID } from 'node:crypto';
import AccountService from '@/account/v1/account.service.js';
import { publishAccountCreate } from '@/events/producers/accountCreate.js';
import { publishAccountDelete } from '@/events/producers/accountDelete.js';

type Event = {
    publishAccountCreate: jest.Mocked<typeof publishAccountCreate>
    publishAccountDelete: jest.Mocked<typeof publishAccountDelete>
}

describe("Account Service Unit Test",() => {

    let accountService: AccountService;
    let accountRepository: jest.Mocked<DbQuery>;
    let event: Event;
    // Mocking and initialize
    beforeAll(() => {

        accountRepository = {
            findAccountByUserId: jest.fn(),
            createAccount: jest.fn(),
            findAccountByNumber: jest.fn(),
            deleteAccount: jest.fn(),
            accountTransaction: jest.fn()
        } 
        event = {
            publishAccountCreate: jest.fn(),
            publishAccountDelete: jest.fn()
        }
        accountService = new AccountService(accountRepository,event);
    })

    describe("Create Account",() => {

        it('When pass with valid data,should retuen Created Account', async() => {
                    // Arrange
                    const userId = randomUUID();
                    const accountName = "Mock Account";
                    const accountType = "savings" as const;
                   
                    const createdAccount = createAccountMock(accountName,accountType);
                    // Act
                    accountRepository.createAccount.mockResolvedValue(createdAccount);
                    const newAccount = await accountService.createAccount(userId,createdAccount);
                    // Assert
                    expect(event.publishAccountCreate).toHaveBeenCalledTimes(1);
                    expect(newAccount).toMatchObject(createdAccount);  
        })
    })

    describe("Get Accounts",() => {

        it('When pass with exist userId,should return array of User Accounts', async() => {
                    // Arrange
                    const userId = randomUUID();
                   const accountType = "savings" as const;
                    const accounts = [
                        createAccountMock("Mock account 1",accountType),
                        createAccountMock("Mock account 2",accountType)
                    ];
                    // Act
                    accountRepository.findAccountByUserId.mockResolvedValue(accounts);
                    const userAccounts = await accountService.getAccounts(userId);
                    // Assert
                    expect(userAccounts.length).toBe(accounts.length);
                    expect(userAccounts[0]).toMatchObject(accounts[0]);  
        })
    })

    describe("Delete Account",() => {

        it('When pass with exist userId and exist account number,should return undefined', async() => {
                    // Arrange
                    const userId = randomUUID();
                    const accountName = "Mock Account";
                    const accountType = "savings" as const;
                   
                    const deletedAccount = createAccountMock(accountName,accountType);
                    // Act
                    accountRepository.findAccountByNumber.mockResolvedValue({ ...deletedAccount,userId });
                    accountRepository.deleteAccount.mockResolvedValue(deletedAccount);
                    const result = await accountService.deleteAccount(userId,deletedAccount.accountNumber);
                    // Assert
                    expect(event.publishAccountDelete).toHaveBeenCalledTimes(1);
                    expect(result).toBeUndefined();
        })

        it('When pass with exist userId and not exist account number,should throw NotFound Error', async() => {
                    // Arrange
                    const userId = randomUUID();
                    const accountName = "Mock Account";
                    const accountType = "savings" as const;
                   
                    const deletedAccount = createAccountMock(accountName,accountType);
                    // Act
                    accountRepository.findAccountByNumber.mockResolvedValue(null as any);
                    // Assert
                    await expect(accountService.deleteAccount(userId,deletedAccount.accountNumber)).rejects.toThrow("Account not exist");      
        })

        it('When pass with exist userId and not match account number,should throw NotFound Error', async() => {
                    // Arrange
                    const userId = randomUUID();
                    const accountName = "Mock Account";
                    const accountType = "savings" as const;
                    const notMatchId = randomUUID();
                    const deletedAccount = createAccountMock(accountName,accountType);
                    // Act
                    accountRepository.findAccountByNumber.mockResolvedValue({ userId: notMatchId,balance: deletedAccount.balance});
                    // Assert
                    await expect(accountService.deleteAccount(userId,deletedAccount.accountNumber)).rejects.toThrow("Account not exist");      
        })
    })

    describe("Internal Transaction",() => {

        it('When pass with exist userId and exist account number,should return Account Info', async() => {
                    // Arrange
                    const userId = randomUUID();
                    const accountName = "Mock Account";
                    const accountType = "savings" as const;
                   
                    const transactionAccount = createAccountMock(accountName,accountType);
                    const transactionInfo = {
                        type: "credit" as const,
                        accountNumber: transactionAccount.accountNumber,
                        amount: 300
                    }
                    // Act
                    accountRepository.findAccountByNumber.mockResolvedValue({ userId,balance: transactionAccount.balance });
                    accountRepository.accountTransaction.mockResolvedValue({ ...transactionAccount,balance: "300" });
                    const result = await accountService.internalTransaction(userId,transactionInfo);
                    // Assert
                    expect(result).toMatchObject({ ...transactionAccount,balance: "300" });
        })

        it('When pass with exist userId and not exist account number,should throw NotFound Error', async() => {
                    // Arrange
                    const userId = randomUUID();
                    const accountName = "Mock Account";
                    const accountType = "savings" as const;
                   
                    const transactionAccount = createAccountMock(accountName,accountType);
                    const transactionInfo = {
                        type: "credit" as const,
                        accountNumber: transactionAccount.accountNumber,
                        amount: 300
                    }
                    // Act
                    accountRepository.findAccountByNumber.mockResolvedValue(null as any);
                    // Assert
                    await expect(accountService.internalTransaction(userId,transactionInfo)).rejects.toThrow("Account not exist");      
        })

        it('When pass with exist userId and not match account number,should throw NotFound Error', async() => {
                    // Arrange
                    const userId = randomUUID();
                    const accountName = "Mock Account";
                    const accountType = "savings" as const;
                    const notMatchId = randomUUID();
                    const transactionAccount = createAccountMock(accountName,accountType);
                    const transactionInfo = {
                        type: "credit" as const,
                        accountNumber: transactionAccount.accountNumber,
                        amount: 300
                    }
                    // Act
                    accountRepository.findAccountByNumber.mockResolvedValue({ userId: notMatchId,balance: transactionAccount.balance });
                    accountRepository.accountTransaction.mockResolvedValue({ ...transactionAccount,balance: "300" });
                    // Assert
                    await expect(accountService.internalTransaction(userId,transactionInfo)).rejects.toThrow("Account not exist");    
        })
    }) 

})