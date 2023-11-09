import { Request, Response, NextFunction } from 'express';
import { ResponseCode, StatusCode, ResponseType } from '../@types';
import { Toolbox } from '../utils';
import account from "../validations/account"
const { apiResponse } = Toolbox;

async function inspectAccount(req: Request, res: Response, next: NextFunction) {
    try {
        await account.validateAccount(req.body);
        next();
    } catch (error) {
        return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.BAD_REQUEST,
            ResponseCode.VALIDATION_ERROR,
            {},
            error as string
        );
    }
}

export default inspectAccount;