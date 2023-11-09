import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { User, Auth } from "../models"
import { ResponseCode, ResponseType } from '../@types';
import { AppError, StatusCode, Toolbox } from '../utils';
import { HttpCode } from '../exceptions/AppError';
import { env } from '../config';
import { Users } from '../services';


const { apiResponse, isXDaysFromNow } = Toolbox;
const { TokenExpiredError } = jwt;

class Authentications {
    async authenticate(req: Request, res: Response, next: NextFunction) {
        try {
            const authToken = req.headers.authorization;
            if (!authToken)
                throw new AppError(
                    {
                        httpCode: HttpCode.UNAUTHORIZED,
                        description: "Not authorized"
                    }
                );
            const tokenString = authToken.split('Bearer')[1].trim();
            if (!tokenString)
                throw new AppError(
                    {
                        httpCode: HttpCode.UNAUTHORIZED,
                        description: 'No token in header',
                    }
                );
            const decoded: any = jwt.verify(tokenString, env.JWT_SECRET as string);
            const user = await Users.getUserByEmail(decoded?.email);

            if (!decoded || !user)
                throw new AppError(
                    {
                        httpCode: HttpCode.UNAUTHORIZED,
                        description: 'Invalid token',
                    }
                );
            if (user) {
                req.user = user;
            }
            next();
        } catch (error: any) {
            return apiResponse(
                res,
                ResponseType.FAILURE,
                StatusCode.UNAUTHORIZED,
                ResponseCode.FAILURE,
                error.message as string
            );
        }
    }
    catchError(error: any, res: Response) {
        if (error instanceof TokenExpiredError) {
            throw new AppError(
                {
                    httpCode: HttpCode.UNAUTHORIZED,
                    description: "Not authorized! Access Token has expired!"
                }
            );
        }
    }
    async checkUserRole(req: Request, res: Response, next: NextFunction, roleName: string) {
        try {
            let user
            user = await User.findById(req.user.id).exec();

            console.log("REQ BODY", req.user);
            if (!user) {
                return apiResponse(
                    res,
                    ResponseType.FAILURE,
                    StatusCode.NOT_FOUND,
                    ResponseCode.FAILURE,
                    'user not found'
                );
            }

            const roles = await Auth.Role.find({
                _id: { $in: user.roles },
                name: roleName,
            }).exec();

            if (!roles || roles.length === 0) {
                return apiResponse(
                    res,
                    ResponseType.FAILURE,
                    StatusCode.FORBIDEN,
                    ResponseCode.FAILURE,
                    `Require ${roleName} Role!`
                );
            }

            next();
        } catch (err: any) {
            throw new AppError(
                {
                    httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                    description: err.message
                }
            );
        }
    }
    async isAdmin(req: Request, res: Response, next: NextFunction) {
        await this.checkUserRole(req, res, next, "admin");
    };

    async isModerator(req: Request, res: Response, next: NextFunction) {
        await this.checkUserRole(req, res, next, "user");
    };


};

export default new Authentications();
