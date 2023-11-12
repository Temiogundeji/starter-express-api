"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Users_1 = __importDefault(require("../services/Users"));
const Payments_1 = __importDefault(require("./Payments"));
const utils_1 = require("../utils");
const AppError_1 = require("../exceptions/AppError");
const models_1 = require("../models");
const config_1 = require("../config");
class WalletService {
    async save(user, amount, activityType, description) {
        try {
            const paymentObj = {
                amount,
                description
            };
            const metaObj = {
                amount,
                description,
            };
            // Check if user account is activated and user is logged in, check if user has an account
            if (!user.isActive) {
                throw new Error("Account not active");
            }
            //Check if the email of the user passed in is the same as
            //the email in the database
            console.log(user.email, "USER EMAIL");
            const appUser = await Users_1.default.getUserByEmail(user.email);
            // Validate savings amount
            if (Number(amount) < 5000) {
                throw new Error("Amount must be a minimum of 5000");
            }
            // Make payment
            const responseData = await Payments_1.default.initialize(appUser, paymentObj, metaObj, activityType);
            return responseData;
        }
        catch (e) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: e.message
            });
        }
    }
    async validateRecipient(user, withdrawObj, walletId) {
        try {
            // Check if user account is active
            if (!user.isActive) {
                throw new Error("Account not active");
            }
            const appUser = await Users_1.default.getUserByEmail(user.email);
            //Get all successful user savings
            const successfulSavings = await models_1.Transaction.aggregate([
                {
                    $match: {
                        walletId: new mongoose_1.default.Types.ObjectId(walletId),
                        status: { $ne: "failure" },
                        type: "savings"
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: {
                            $sum: {
                                $cond: {
                                    if: { $eq: ["$type", "savings"] },
                                    then: { $multiply: ["$amount", 1] },
                                    else: { $multiply: ["$amount", -1] }
                                }
                            }
                        }
                    }
                },
            ]);
            //Calculate user total savings
            const totalSavings = successfulSavings.map((s) => s?.totalAmount).reduce((curr, acc) => curr + acc, 0);
            (0, config_1.logger)(String(totalSavings), "Total savings");
            (0, config_1.logger)(String(withdrawObj.amount), "Withdrawal amount");
            if (totalSavings - Number(withdrawObj.amount) === 0)
                throw new Error("Insufficient fund in wallet");
            // Verify recipient
            const responseData = await Payments_1.default.createRecipient(appUser, withdrawObj.accountNumber, withdrawObj.bank);
            console.log(responseData, "RESPONSE TO OUR DATA HERE");
            return responseData;
        }
        catch (e) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: e.message
            });
        }
    }
}
exports.default = new WalletService;
