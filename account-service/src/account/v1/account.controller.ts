import AccountService from "./account.service.js";
import { responseEnvelope } from "@/utils/responseEnvelope.js";
import { UnauthorizedError,BadRequestError } from "@/customs/error/httpErrors.js";
import { RequestHandler } from "express";


export default class AccountController {
   // Dependency injection for testability
   constructor(private accountService: AccountService) {}

    createAccount: RequestHandler = async(req,res) => {
        if(!req.validData) throw new BadRequestError("Invalid Credentials");
        if(!req.user) throw new UnauthorizedError("Invalid Token");
        
        const createdAccount = await this.accountService.createAccount(req.user.sub,req.validData);
        const data = {
            account: createdAccount,
            message: "Successfully create account"
        }
        res.status(201).json(responseEnvelope({
            state: "success",
            data
        }))
    }

    getAccounts: RequestHandler = async(req,res) => {
        if(!req.user) throw new UnauthorizedError("Invalid Token");
        
        const accounts = await this.accountService.getAccounts(req.user.sub);
        const data = {
            accounts,
            message: "Successfully get accounts"
        }
        res.status(200).json(responseEnvelope({
            state: "success",
            data
        }))
    }

    deleteAccount: RequestHandler = async(req,res) => {
        if(!req.user) throw new UnauthorizedError("Invalid Token");
        const { accountNum } = req.params;
        const accountNumber = accountNum as string;
        await this.accountService.deleteAccount(req.user.sub,accountNumber);
        res.status(204).end();
    }

    internalTransaction: RequestHandler = async(req,res) => {
        if(!req.validData) throw new BadRequestError("Invalid Credentials");
        if(!req.user) throw new UnauthorizedError("Invalid Token");

        const result = await this.accountService.internalTransaction(req.user.sub,req.validData);
        const data = {
            transactionDetail: result,
            message: "Transaction Success"
        }
        res.status(200).json(responseEnvelope({
            state: "success",
            data
        }))
    }
}