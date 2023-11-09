"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const _types_1 = require("../@types");
const utils_1 = require("../utils");
const AppError_1 = require("../exceptions/AppError");
const config_1 = require("../config");
const services_1 = require("../services");
const { apiResponse, isXDaysFromNow } = utils_1.Toolbox;
const { TokenExpiredError } = jsonwebtoken_1.default;
class Authentications {
    async authenticate(req, res, next) {
        try {
            const authToken = req.headers.authorization;
            if (!authToken)
                throw new utils_1.AppError({
                    httpCode: AppError_1.HttpCode.UNAUTHORIZED,
                    description: "Not authorized"
                });
            const tokenString = authToken.split('Bearer')[1].trim();
            if (!tokenString)
                throw new utils_1.AppError({
                    httpCode: AppError_1.HttpCode.UNAUTHORIZED,
                    description: 'No token in header',
                });
            const decoded = jsonwebtoken_1.default.verify(tokenString, config_1.env.JWT_SECRET);
            const user = await services_1.Users.getUserByEmail(decoded?.email);
            if (!decoded || !user)
                throw new utils_1.AppError({
                    httpCode: AppError_1.HttpCode.UNAUTHORIZED,
                    description: 'Invalid token',
                });
            if (user) {
                req.user = user;
            }
            next();
        }
        catch (error) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, utils_1.StatusCode.UNAUTHORIZED, _types_1.ResponseCode.FAILURE, error.message);
        }
    }
    catchError(error, res) {
        if (error instanceof TokenExpiredError) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.UNAUTHORIZED,
                description: "Not authorized! Access Token has expired!"
            });
        }
    }
    async checkUserRole(req, res, next, roleName) {
        try {
            let user;
            user = await models_1.User.findById(req.user.id).exec();
            console.log("REQ BODY", req.user);
            if (!user) {
                return apiResponse(res, _types_1.ResponseType.FAILURE, utils_1.StatusCode.NOT_FOUND, _types_1.ResponseCode.FAILURE, 'user not found');
            }
            const roles = await models_1.Auth.Role.find({
                _id: { $in: user.roles },
                name: roleName,
            }).exec();
            if (!roles || roles.length === 0) {
                return apiResponse(res, _types_1.ResponseType.FAILURE, utils_1.StatusCode.FORBIDEN, _types_1.ResponseCode.FAILURE, `Require ${roleName} Role!`);
            }
            next();
        }
        catch (err) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: err.message
            });
        }
    }
    async isAdmin(req, res, next) {
        await this.checkUserRole(req, res, next, "admin");
    }
    ;
    async isModerator(req, res, next) {
        await this.checkUserRole(req, res, next, "user");
    }
    ;
}
;
exports.default = new Authentications();
