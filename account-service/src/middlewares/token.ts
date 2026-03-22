import { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "@customs/error/httpErrors.js";
import { logger } from "@/configs/logger.js";
import { RequestHandler } from "express";
import { verifyToken } from "@/utils/token.js";
import { env } from "@/configs/env.js";
import { redisInstance } from "@/configs/redis.js";

interface AuthPayload extends JwtPayload {
    sub: string
    jti: string
}

export const tokenVerify: RequestHandler = async(req,_res,next) => {
       const bearerToken = req.get("Authorization");
       if(!bearerToken || !bearerToken.split(" ")[1]) {
        logger.warn(`Token Verify: Not Provide token`);
        throw new UnauthorizedError("Unauthenticated");
       } 
       const token = bearerToken.split(" ")[1];
       
       const decode = verifyToken(token,env.TOKEN_SECRET) as AuthPayload;
       if(!decode) {
         logger.warn(`Token Verify: Invalid or Expired token: ${token}`);
         throw new UnauthorizedError("Invalid or Expired token");
       }
       const key = `blacklist:${decode.jti}`;
       const value = await redisInstance.get(key);
       if(value) {
         logger.warn(`Token Verify: token with jti ${decode.jti} has been in black list`);
         throw new UnauthorizedError("Invalid or Expired token");
       }
       req.user = decode;
       return next();
}