// Third party
import express from "express";
// Services
import AuthController from "./auth.controller.js";
// Middleware
import { schemaValidator } from "@middlewares/schemaValidators.js";

// Schema
import { LoginUserSchema } from "./schema/login.js";
import { CreateUserSchema } from "./schema/signup.js";
import AuthService from "./auth.service.js";
import { DbQuery } from "@/db/query/auth.js";
import { redisInstance } from "@/configs/redis.js";
import { tokenVerify } from "@/middlewares/token.js";

export const authRouter = express.Router();

// Initialize instance
const dbQuery = new DbQuery();
const redisClient = redisInstance;
const authService = new AuthService(dbQuery,redisClient);
const authController = new AuthController(authService);

authRouter.post("/login",schemaValidator(LoginUserSchema),authController.loginUser);
authRouter.post("/signup",schemaValidator(CreateUserSchema),authController.signupUser);
authRouter.post("/logout",tokenVerify,authController.logoutUser);
