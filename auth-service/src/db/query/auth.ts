import { eq } from "drizzle-orm";
import { dbInstance } from "../db.js";
import { credentials } from "../schema/credential.js";
import { users } from "../schema/user.js";
import { CreateUserType } from "@/auth/v1/schema/signup.js";
import { logger } from "@/configs/logger.js";


export class DbQuery {
    
    async findCredentialByEmail(email: string) {
         const [existUser] = await dbInstance.select({  
              password: credentials.password
         })
                   .from(credentials)
                   .where(eq(credentials.email,email));
         return existUser;
    }

    async findUserByEmail(email: string) {
         const [existUser] = await dbInstance.select({  
              id: users.id
         })
                   .from(users)
                   .where(eq(users.email,email));
         return existUser;
    }

    async transactionCreate(user: CreateUserType) {

        try {
            
            return await dbInstance.transaction(async (tx) => {
                   
                const [createdUser] = await tx.insert(users)
                        .values({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email
                        }).returning({ id: users.id,email: users.email })
                await tx.insert(credentials)
                        .values({
                            userId: createdUser.id,
                            email: user.email,
                            password: user.password
                        })
                logger.info(`Transaction create success`);
                return createdUser;
            })
        } catch (error) {
            logger.error(`Transaction Error: ${error}`);
            throw error;
        }
    }
}