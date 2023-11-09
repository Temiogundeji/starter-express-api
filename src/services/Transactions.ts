import mongoose, { ObjectId, mongo } from "mongoose";
import { ITransaction } from "../@types/transaction";
import { AppError } from "../utils";
import { HttpCode } from "../exceptions/AppError";
import Transaction from "../models/Transaction";
import { log } from "winston";

class TransactionService {
    async createTransaction(transObj: ITransaction) {
        try {
            const transaction = await Transaction.create(transObj);
            return transaction;
        }
        catch (error: any) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: error.message || "Error fetching transactions"
            }
            );
        }
    }
    async getWalletTransactions(walletId: string) {
        try {
            const transactions = await Transaction.aggregate([
                {
                    $match: { walletId: new mongoose.Types.ObjectId(walletId) }
                }
            ]);
            return transactions;
        } catch (error) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error fetching transactions"
            }
            );
        }
    }
    async getATransaction(id: string) {
        try {
            const transaction = await Transaction.findOne({ _id: String(id) });
            log(`Tranaction for ${id}`, transaction);
            return transaction;
        }
        catch (error) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error fetching transactions"
            }
            );
        }
    }
}

export default new TransactionService();