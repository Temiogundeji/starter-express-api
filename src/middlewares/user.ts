import { Request, Response, NextFunction } from 'express';
import { RegisterType, ResponseCode, StatusCode, ResponseType } from '../@types';
import { Toolbox } from '../utils';
import userValidations from '../validations/users';

const { apiResponse } = Toolbox;

const UserMiddleware = {
    async inspectRegisterUser(req: Request, res: Response, next: NextFunction) {
        try {
            await userValidations.validateSignUp(req.body);
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
    async inspectAuthRoutes(req: Request, res: Response, next: NextFunction) {
        try {
            await userValidations.validateAuth(req.body);
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
    async inspectVerifyToken(req: Request, res: Response, next: NextFunction) {
        try {
            await userValidations.validateVerifyToken(req.query as RegisterType);
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
    async inspectToggleActivationStatus(req: Request, res: Response, next: NextFunction) {
        try {
            await userValidations.validateToggleStatus(req.body);
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

export default UserMiddleware;
