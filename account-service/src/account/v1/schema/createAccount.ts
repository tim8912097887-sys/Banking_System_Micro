import { AccountTypeEnum } from "@/db/schema/account.js";
import z from "zod";

export const CreateAccountSchema = z.object({
    accountName: z.string("Account name must be string")
                  .min(2,"Account name at least two characters"),
    accountType: z.enum(AccountTypeEnum.enumValues,{ error: "Account type must be current or savings" })
})

export type CreateAccountType = z.infer<typeof CreateAccountSchema>;