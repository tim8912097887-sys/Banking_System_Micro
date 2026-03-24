import { jest } from '@jest/globals';
import { randomUUID } from 'node:crypto';
import AccountController from "@/account/v1/account.controller.js";
import AccountService from "@/account/v1/account.service.js";
import { env } from '@/configs/env.js';
import { createMockNext, createMockRequest, createMockResponse } from 'test/utils/expressMock.js';
import { successResponseMock } from 'test/utils/responseMock.js';
import { createAccountMock } from 'test/utils/account.utils.js';
import { generateNumber } from '@/utils/generateNumber.js';


describe("Account Controller Unit Test",() => {

     let controller: AccountController;
     let mockService: jest.Mocked<AccountService>;

     beforeAll(() => {
        mockService = {
            createAccount: jest.fn(),
            getAccounts: jest.fn(),
            deleteAccount: jest.fn(),
            internalTransaction: jest.fn()
        } as any
        controller = new AccountController(mockService);
     })

     describe("Create Account",() => {

        it('When pass with valid token and valid data,should response with Success message and Created Account', async() => {
            // Arrange
            const accountName = "Mock Account";
            const accountType = "savings" as const;
            const req = createMockRequest({
                user: { 
                    sub: randomUUID(),
                    jti: randomUUID()
                 },
                validData: {
                    accountName,
                    accountType
                }
            })
            const res = createMockResponse();
            const next = createMockNext();
            const createdAccount = createAccountMock(accountName,accountType);
            // Act
            mockService.createAccount.mockResolvedValue(createdAccount);
            await controller.createAccount(req,res,next);
            // Assert
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(successResponseMock(
                {
                    account: createdAccount,
                    message: expect.any(String)
                },
                env.SERVICE_NAME
            ));
        })
        
     })

     describe("Get Accounts",() => {

        it('When pass with valid token,should response with Success message and correspond User Accounts', async() => {
            // Arrange
            const accountType = "savings" as const;
            const req = createMockRequest({
                user: { 
                    sub: randomUUID(),
                    jti: randomUUID()
                 }
            })
            const res = createMockResponse();
            const next = createMockNext();
            const accounts = [
                createAccountMock("Mock account 1",accountType),
                createAccountMock("Mock account 2",accountType)
            ];
            // Act
            mockService.getAccounts.mockResolvedValue(accounts);
            await controller.getAccounts(req,res,next);
            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(successResponseMock(
                {
                    accounts,
                    message: expect.any(String)
                },
                env.SERVICE_NAME
            ));
        })
        
     })

     describe("Delete Account",() => {

        it('When pass with valid token and exist account,should response with 204 status code', async() => {
            // Arrange
            const req = createMockRequest({
                user: { 
                    sub: randomUUID(),
                    jti: randomUUID()
                },
                params: {
                    accountNum: generateNumber("savings")
                }
            })
            const res = createMockResponse();
            const next = createMockNext();
            
            // Act
            mockService.deleteAccount.mockResolvedValue(undefined);
            await controller.deleteAccount(req,res,next);
            // Assert
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.end).toHaveBeenCalledTimes(1);
        })
        
     })

     describe("Internal Transaction",() => {

        it('When pass with valid token and valid data,should response with 204 status code', async() => {
            // Arrange
            const accountNumber = generateNumber("savings");
            const type = "credit" as const;
            const amount = 300;
            const req = createMockRequest({
                user: { 
                    sub: randomUUID(),
                    jti: randomUUID()
                },
                validData: {
                    accountNumber,
                    type,
                    amount
                }
            })
            const res = createMockResponse();
            const next = createMockNext();
            const account = createAccountMock("Mock account","savings");
            // Act
            mockService.internalTransaction.mockResolvedValue({ ...account,balance: amount.toString() });
            await controller.internalTransaction(req,res,next);
            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(successResponseMock(
                {
                    transactionDetail: { ...account,balance: amount.toString() },
                    message: expect.any(String)
                },
                env.SERVICE_NAME
            ));
        })
        
     })
})