import { generateNumber } from "@/utils/generateNumber.js";
import { randomUUID } from "node:crypto";

export const createAccountMock = (accountName: string,accountType: "current" | "savings") => {

    const accountId = randomUUID();
    const accountNumber = generateNumber(accountType);
    return {
        id: accountId,
        accountName,
        accountNumber,
        accountStatus: "active" as const,
        accountType,
        balance: "0"
    }
}