import jwt from "jsonwebtoken"
import { logger } from "@configs/logger.js"

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
