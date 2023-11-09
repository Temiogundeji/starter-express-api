
export interface IWithdraw {
    source: string,
    amount: number,
    reason: string,
    accountNumber: string,
    bank: string,
    activityType: "savings" | "withdrawal",
    description?: string
}
