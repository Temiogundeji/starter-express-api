import { Document, ObjectId } from "mongoose";
export interface ITransaction {
    walletId: ObjectId,
    payment_ref: Object,
    amount: Number,
    description: string,
    type: "savings" | "withdrawal",
    status: "success" | "failure" | "pending",
}