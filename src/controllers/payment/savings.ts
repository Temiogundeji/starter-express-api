import { Request, Response } from "express";
import { Toolbox } from "../../utils";
import { ResponseCode, ResponseType, StatusCode } from "../../@types";
const { apiResponse } = Toolbox;
import WalletService from "../../services/Wallets";
import log from "../../config/logger";

async function saveMoney(req: Request, res: Response) {
    const { amount, description, type } = req.body;
    try {
        const user = req.user;
        console.log(user, "USER")
        if (!user) {
            return apiResponse(
                res,
                ResponseType.FAILURE,
                StatusCode.NOT_FOUND,
                ResponseCode.FAILURE,
                "User not found"
            )
        }
        const savingsRes = await WalletService.save(user, amount, description, type);
        console.log(savingsRes, "SAVINGS RESPONSE HERE");
        log("SAVINGS RESPONSE", savingsRes);

        return apiResponse(res, ResponseType.SUCCESS, StatusCode.OK, ResponseCode.SUCCESS, {
            ...savingsRes,
            type
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


export default saveMoney;