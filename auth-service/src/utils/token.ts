import jwt from "jsonwebtoken"
import { randomUUID } from "node:crypto";
import { logger } from "@configs/logger.js"

type Payload = {
    sub: string
}

export const createToken = (payLoad: Payload,secret: string,expiresIn: number) => {
     const jti = randomUUID();
     const token = jwt.sign({ ...payLoad,jti },secret,{
        expiresIn,
        algorithm: "HS256" 
     })
     return token;
}

export const verifyToken = (token: string,secret: string) => {
     try {
         const decode = jwt.verify(token,secret,{
            algorithms: ["HS256"] 
         })

         return decode;
     } catch (error) {
         logger.error(`JWT Verification: ${error}`);
         return;
     }
}
