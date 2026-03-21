import { JwtPayload } from "jsonwebtoken";
import { LoginUserType } from "./schema/login.js";
import AuthService from "./auth.service.js";
import { env } from "@/configs/env.js";
import { createToken } from "@utils/token.js";
import { responseEnvelope } from "@/utils/responseEnvelope.js";
import { CreateUserType } from "./schema/signup.js";
import { UnauthorizedError,BadRequestError } from "@/customs/error/httpErrors.js";
import { RequestHandler } from "express";


interface AuthPayload extends JwtPayload {
    sub: string
    jti: string
}

export default class AuthController {
   // Dependency injection for testability
   constructor(private authService: AuthService) {}

   loginUser: RequestHandler = async(req,res) => {
        if(!req.validData) throw new BadRequestError("Invalid Credentials");
        const existUser = await this.authService.login(req.validData as LoginUserType);
        const payload = { sub: existUser.id };
        const token = createToken(payload,env.TOKEN_SECRET,env.TOKEN_EXPIRED);
        const data = { user: existUser,token,message: "Successfully Login" };
        
        res.status(200).json(responseEnvelope({ state: "success",data }));
    }

    signupUser: RequestHandler = async(req,res) => {
        if(!req.validData) throw new BadRequestError("Invalid Credential");
        await this.authService.signup(req.validData as CreateUserType);
        const data = { message: "Please login" };
        res.status(201).json(responseEnvelope({ state: "success",data }));
    }

    logoutUser: RequestHandler = async(req,res) => {
        if(!req.user) throw new UnauthorizedError("Invalid Token");
        const user = req.user as AuthPayload;
        await this.authService.logout(user.jti,user.exp as number);
        res.status(204).end();
    }
}