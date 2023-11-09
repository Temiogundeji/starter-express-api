"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const _types_1 = require("../../@types");
const { apiResponse } = utils_1.Toolbox;
const Wallets_1 = __importDefault(require("../../services/Wallets"));
const Payments_1 = __importDefault(require("../../services/Payments"));
const Transactions_1 = __importDefault(require("../../services/Transactions"));
const models_1 = require("../../models");
async function withdrawMoney(req, res) {
    const { walletId, amount, accountNumber, reason, bank, activityType, description } = req.body;
    try {
        const user = req.user;
        if (!user) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.NOT_FOUND, _types_1.ResponseCode.FAILURE, "User not found");
        }
        const recipientData = await Wallets_1.default.validateRecipient(user, {
            amount,
            source: "balance",
            reason,
            accountNumber,
            bank,
            activityType,
            description
        }, walletId);
        const transferRes = await Payments_1.default.makeTransfer(user, { accountNumber }, {
            amount,
            source: "balance",
            reason,
        }, recipientData?.data?.recipient_code);
        if (transferRes?.status === "success") {
            //Update wallet to reflect new user savings
            const updatedWallet = await models_1.Wallet.findOneAndUpdate({ userId: user._id }, { $inc: { balance: -(Number(amount)) } }, { new: true });
            console.log({
                walletId: updatedWallet?._id,
                payment_ref: transferRes?.reference,
                amount: amount,
                description: transferRes?.reason,
                type: "withdrawal",
                status: "pending"
            }, "TRANSACTION");
            //Create new pending transaction
            await Transactions_1.default.createTransaction({
                walletId: updatedWallet?._id,
                payment_ref: transferRes?.reference,
                amount: amount,
                description: transferRes?.reason,
                type: "withdrawal",
                status: "pending"
            });
        }
        return apiResponse(res, _types_1.ResponseType.SUCCESS, _types_1.StatusCode.OK, _types_1.ResponseCode.SUCCESS, {
            ...transferRes,
        });
    }
    catch (e) {
        return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.INTERNAL_SERVER_ERROR, _types_1.ResponseCode.FAILURE, {}, `looks like something went wrong: ${JSON.stringify(e.message || e)} `);
    }
}
exports.default = withdrawMoney;
