import { Request, Response, NextFunction } from 'express';
import { ResponseCode, StatusCode, ResponseType } from '../@types';
import { Toolbox } from '../utils';
import paymentValidations from '../validations/payments';

const { apiResponse } = Toolbox;

const PaymentMiddleware = {
    async inspectMakePayment(req: Request, res: Response, next: NextFunction) {
        try {
            await paymentValidations.validatePayment(req.body);
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
    },
    async inspectWithdraw(req: Request, res: Response, next: NextFunction) {
        try {
            await paymentValidations.validateWithdraw(req.body);
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
    },
};

export default PaymentMiddleware;
