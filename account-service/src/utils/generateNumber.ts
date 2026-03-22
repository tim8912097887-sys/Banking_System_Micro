import { AccountTypeEnum } from "@/db/schema/account.js"
import { customAlphabet } from "nanoid"

type AccountType = typeof AccountTypeEnum.enumValues[0] | typeof AccountTypeEnum.enumValues[1]

const ACCOUNT_TYPE = {
    current: 11,
    savings: 13
}

export const generateNumber = (accountType: AccountType) => {
    const randomNum = customAlphabet("0123456789",9);
    const num = randomNum(9);
    const yearNum = new Date().getFullYear();
    return `${ACCOUNT_TYPE[accountType]}${yearNum}${num}`;
}