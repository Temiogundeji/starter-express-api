"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../utils");
const AppError_1 = require("../exceptions/AppError");
const Transaction_1 = __importDefault(require("../models/Transaction"));
const winston_1 = require("winston");
class TransactionService {
    async createTransaction(transObj) {
        try {
            const transaction = await Transaction_1.default.create(transObj);
            return transaction;
        }
        catch (error) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: error.message || "Error fetching transactions"
            });
        }
    }
    async getWalletTransactions(walletId) {
        try {
            const transactions = await Transaction_1.default.aggregate([
                {
                    $match: { walletId: new mongoose_1.default.Types.ObjectId(walletId) }
                }
            ]);
            return transactions;
        }
        catch (error) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error fetching transactions"
            });
        }
    }
    async getATransaction(id) {
        try {
            const transaction = await Transaction_1.default.findOne({ _id: String(id) });
            (0, winston_1.log)(`Tranaction for ${id}`, transaction);
            return transaction;
        }
        catch (error) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error fetching transactions"
            });
        }
    }
}
exports.default = new TransactionService();
