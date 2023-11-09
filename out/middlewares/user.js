"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _types_1 = require("../@types");
const utils_1 = require("../utils");
const users_1 = __importDefault(require("../validations/users"));
const { apiResponse } = utils_1.Toolbox;
const UserMiddleware = {
    async inspectRegisterUser(req, res, next) {
        try {
            await users_1.default.validateSignUp(req.body);
            next();
        }
        catch (error) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.BAD_REQUEST, _types_1.ResponseCode.VALIDATION_ERROR, {}, error);
        }
    },
    async inspectAuthRoutes(req, res, next) {
        try {
            await users_1.default.validateAuth(req.body);
            next();
        }
        catch (error) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.BAD_REQUEST, _types_1.ResponseCode.VALIDATION_ERROR, {}, error);
        }
    },
    async inspectVerifyToken(req, res, next) {
        try {
            await users_1.default.validateVerifyToken(req.query);
            next();
        }
        catch (error) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.BAD_REQUEST, _types_1.ResponseCode.VALIDATION_ERROR, {}, error);
        }
    },
    async inspectToggleActivationStatus(req, res, next) {
        try {
            await users_1.default.validateToggleStatus(req.body);
            next();
        }
        catch (error) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.BAD_REQUEST, _types_1.ResponseCode.VALIDATION_ERROR, {}, error);
        }
    },
};
exports.default = UserMiddleware;
