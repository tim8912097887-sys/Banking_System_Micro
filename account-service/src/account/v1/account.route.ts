// Third party
import express from "express";
// Services
import AccountController from "./account.controller.js";
// Middleware
import { schemaValidator } from "@middlewares/schemaValidators.js";

// Schema
import { CreateAccountSchema } from "./schema/createAccount.js";
import AccountService from "./account.service.js";
import { DbQuery } from "@/db/query/account.js";
import { tokenVerify } from "@/middlewares/token.js";
import { TransactionSchema } from "./schema/transaction.js";

export const accountRouter = express.Router();

// Initialize instance
const dbQuery = new DbQuery();
const accountService = new AccountService(dbQuery);
const accountController = new AccountController(accountService);

accountRouter.post("/",tokenVerify,schemaValidator(CreateAccountSchema),accountController.createAccount);
accountRouter.get("/",tokenVerify,accountController.getAccounts);
accountRouter.delete("/:accountNum",tokenVerify,accountController.deleteAccount);
accountRouter.post("/transactions",tokenVerify,schemaValidator(TransactionSchema),accountController.internalTransaction);
