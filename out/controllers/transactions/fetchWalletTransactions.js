"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const _types_1 = require("../../@types");
const { apiResponse } = utils_1.Toolbox;
const Transactions_1 = __importDefault(require("../../services/Transactions"));
const logger_1 = __importDefault(require("../../config/logger"));
async function fetchWalletTransactions(req, res) {
    const { walletId } = req.params;
    try {
        const user = req.user;
        if (!user) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.NOT_FOUND, _types_1.ResponseCode.FAILURE, "User not found");
        }
        const transactions = await Transactions_1.default.getWalletTransactions(walletId);
        if (!transactions) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.NOT_FOUND, _types_1.ResponseCode.FAILURE, "Transactions not found");
        }
        (0, logger_1.default)("Wallet Transactions", transactions);
        return apiResponse(res, _types_1.ResponseType.SUCCESS, _types_1.StatusCode.OK, _types_1.ResponseCode.SUCCESS, {
            transactions: [...transactions],
        });
    }
    catch (e) {
        return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.INTERNAL_SERVER_ERROR, _types_1.ResponseCode.FAILURE, {}, `looks like something went wrong: ${JSON.stringify(e.message || e)} `);
    }
}
exports.default = fetchWalletTransactions;
