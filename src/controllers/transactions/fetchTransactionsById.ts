import { Request, Response } from "express";
import { Toolbox } from "../../utils";
import { ResponseCode, ResponseType, StatusCode } from "../../@types";
const { apiResponse } = Toolbox;
import TransactionService from "../../services/Transactions";
import log from "../../config/logger";
import mongoose from "mongoose";

async function fetchTransactionsById(req: Request, res: Response) {
    const { id } = req.params;
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

        const transaction = await TransactionService.getATransaction(id);
        if (!transaction) {
            return apiResponse(
                res,
                ResponseType.FAILURE,
                StatusCode.NOT_FOUND,
                ResponseCode.FAILURE,
                "Transaction not found"
            )
        }

        log("Transaction", transaction);
        return apiResponse(res, ResponseType.SUCCESS, StatusCode.OK, ResponseCode.SUCCESS, {
            transaction,
        }
        )
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

export default fetchTransactionsById;