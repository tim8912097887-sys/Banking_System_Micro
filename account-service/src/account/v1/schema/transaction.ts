import z from "zod";

export const TransactionSchema = z.object({
    accountNumber: z.string().length(15),
    amount: z.number().positive().multipleOf(0.01),
    type: z.enum(['credit','debit'],{ error: "Type must be credit or debit" }),
})

export type TransactionType = z.infer<typeof TransactionSchema>;