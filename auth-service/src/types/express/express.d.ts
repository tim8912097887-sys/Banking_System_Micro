import { CreateUserType } from "@routes/v1/auth/schemas/signup.js";
import { LoginUserType } from "@routes/v1/auth/schemas/login.js";
import { ForgotPasswordType } from "@routes/v1/auth/schemas/forgotPassword.js";
import { ResetPasswordType } from "@routes/v1/auth/schemas/resetPassword.js";
import { JwtPayload } from "jsonwebtoken"
import { VerifyAccountType } from "@routes/v1/auth/schema/verifyAccount.ts";

interface AuthPayload extends JwtPayload {
    sub: string
    jti: string
}

declare global {
  namespace Express {
    interface Request {
        validData?: CreateUserType | LoginUserType
        user?: AuthPayload
    }
  }
}