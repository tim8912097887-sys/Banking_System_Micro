import { BadRequestError } from "@/customs/error/httpErrors.js";
import { LoginUserType } from "./schema/login.js";
import { CreateUserType } from "./schema/signup.js";
import { logger } from "@/configs/logger.js";
import { comparePassword, hashPassword } from "@utils/password.js";
import { DbQuery } from "@/db/query/auth.js";
import { Redis } from "ioredis";
import { publishUserRegister } from "@/events/producers/userRegister.js";

export default class AuthService {
    

    constructor(
        private dbQuery: DbQuery,
        private redisClient: Redis
    ) {}

    async login(user: LoginUserType) {
        const existUser = await this.dbQuery.findCredentialByEmail(user.email);
        if(!existUser) {
            logger.warn(`Login User: user try to login with email ${user.email} that is not exist`);
            throw new BadRequestError(`Email or Password is not correct`);
        } 
        // Compare password
        const isMatch = await comparePassword(user.password,existUser.password);
        if(!isMatch) {
            logger.warn(`Login User: user try to login with email ${user.email} with wrong password`);
            throw new BadRequestError(`Email or Password is not correct`);
        } 
        logger.info(`User Login: Email ${user.email} success`);
        const userInfo = this.dbQuery.findUserByEmail(user.email);
        return userInfo;
    }

    async signup(user: CreateUserType) {
        
        // Success if email already exist for security
        const existCredential = await this.dbQuery.findCredentialByEmail(user.email);
        if(existCredential) {
            logger.warn(`Signup User: user signup with email ${user.email} exist in credential db`);
            return;
        } 
        const existUser = await this.dbQuery.findUserByEmail(user.email);
        if(existUser) {
            logger.warn(`Signup User: user signup with email ${user.email} exist in user db`);
            return;
        } 
        const hashedPassword = await hashPassword(user.password);
        user.password = hashedPassword;
        const createdUser = await this.dbQuery.transactionCreate(user);
        await publishUserRegister({ key: createdUser.id,value: createdUser });
        return;
    }

    async logout(jti: string,expiredAt: number) {
        
        const key = `blacklist:${jti}`;
        const leftTime = expiredAt-Math.floor(Date.now()/1000);
        if(leftTime > 0) await this.redisClient.set(key,1,"EX",leftTime);
        return; 
    }
}