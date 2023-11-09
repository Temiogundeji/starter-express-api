import { Request, Response } from "express";
import { Toolbox } from "../../utils";
import { ResponseCode, ResponseType, StatusCode } from "../../@types";
const { apiResponse } = Toolbox;
import WalletService from "../../services/Wallets";
import Payments from "../../services/Payments";
import log from "../../config/logger";
import Transactions from "../../services/Transactions";
import { Wallet } from "../../models";

async function withdrawMoney(req: Request, res: Response) {
    const { walletId, amount, accountNumber, reason, bank, activityType, description } = req.body;

    try {
        const user = req.user;
        if (!user) {
            return apiResponse(
                res,
                ResponseType.FAILURE,
                StatusCode.NOT_FOUND,
                ResponseCode.FAILURE,
                "User not found"
            )
        }


        const recipientData = await WalletService.validateRecipient(user, {
            amount,
            source: "balance",
            reason,
            accountNumber,
            bank,
            activityType,
            description
        }, walletId);

        const transferRes = await Payments.makeTransfer(user, { accountNumber }, {
            amount,
            source: "balance",
            reason,
        }, recipientData?.data?.recipient_code);

        if (transferRes?.status === "success") {
            //Update wallet to reflect new user savings
            const updatedWallet = await Wallet.findOneAndUpdate(
                { userId: user._id },
                { $inc: { balance: - (Number(amount)) } },
                { new: true }
            );

            console.log({
                walletId: updatedWallet?._id,
                payment_ref: transferRes?.reference,
                amount: amount,
                description: transferRes?.reason,
                type: "withdrawal",
                status: "pending"
            }, "TRANSACTION")

            //Create new pending transaction
            await Transactions.createTransaction({
                walletId: updatedWallet?._id,
                payment_ref: transferRes?.reference,
                amount: amount,
                description: transferRes?.reason,
                type: "withdrawal",
                status: "pending"
            });
        }

        return apiResponse(res, ResponseType.SUCCESS, StatusCode.OK, ResponseCode.SUCCESS, {
            ...transferRes,
        });
    }
    catch (e: any) {
        return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.INTERNAL_SERVER_ERROR,
            ResponseCode.FAILURE,
            {},
            `looks like something went wrong: ${JSON.stringify(e.message || e)} `
        );
    }
}


export default withdrawMoney;