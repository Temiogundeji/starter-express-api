import mongoose from "mongoose";
import { IUser } from "../@types";
import UserService from "../services/Users"
import Payments from "./Payments";
import { AppError } from "../utils";
import { HttpCode } from "../exceptions/AppError";
import { IWithdraw } from "../@types/withdraw";
import { Transaction } from "../models";
import { logger } from "../config";

class WalletService {
    async save(user: IUser, amount: number, activityType: string, description?: string) {
        try {
            const paymentObj: Object = {
                amount,
                description
            };

            const metaObj: Object = {
                amount,
                description,
            }
            // Check if user account is activated and user is logged in, check if user has an account
            if (!user.isActive) {
                throw new Error("Account not active");
            }
            //Check if the email of the user passed in is the same as
            //the email in the database

            console.log(user.email, "USER EMAIL")
            const appUser: any = await UserService.getUserByEmail(user.email as string);
            // Validate savings amount
            if (Number(amount) < 5000) {
                throw new Error("Amount must be a minimum of 5000");
            }
            // Make payment
            const responseData: any = await Payments.initialize(appUser, paymentObj, metaObj, activityType);
            return responseData;

        }
        catch (e: any) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: e.message
            }
            );
        }
    }
    async validateRecipient(user: IUser, withdrawObj: IWithdraw, walletId: string) {
        try {
            // Check if user account is active
            if (!user.isActive) {
                throw new Error("Account not active");
            }
            const appUser: any = await UserService.getUserByEmail(user.email as string);
            //Get all successful user savings
            const successfulSavings = await Transaction.aggregate([
                {
                    $match: {
                        walletId: new mongoose.Types.ObjectId(walletId),
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
            const totalSavings: number = successfulSavings.map((s: any) => s?.totalAmount).reduce((curr: number, acc: number) => curr + acc, 0);
            logger(String(totalSavings), "Total savings");
            logger(String(withdrawObj.amount), "Withdrawal amount");

            if (totalSavings - Number(withdrawObj.amount) === 0) throw new Error("Insufficient fund in wallet");
            // Verify recipient
            const responseData: any = await Payments.createRecipient(appUser, withdrawObj.accountNumber, withdrawObj.bank);

            console.log(responseData, "RESPONSE TO OUR DATA HERE")
            return responseData;
        }
        catch (e: any) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: e.message
            });
        }
    }

}

export default new WalletService;