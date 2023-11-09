import { Request, Response } from "express";
import Payments from "../../services/Payments";
import { ResponseCode, ResponseType, StatusCode } from "../../@types";
import { AppError } from "../../utils";
import { HttpCode } from "../../exceptions/AppError";
import { Toolbox } from "../../utils";

const { apiResponse } = Toolbox;


async function resolveAccountNumber(req: Request, res: Response) {
    const { accountNumber, bank } = req.body;
    try {
        const accountResponse = await Payments.resolveAccountNumber(accountNumber, bank);
        return apiResponse(res, ResponseType.SUCCESS, StatusCode.OK, ResponseCode.SUCCESS, {
            ...accountResponse,
        });
    }
    catch (e: any) {
        throw new AppError({
            httpCode: HttpCode.INTERNAL_SERVER_ERROR,
            description: e.message
        });
    }
}

export default resolveAccountNumber;