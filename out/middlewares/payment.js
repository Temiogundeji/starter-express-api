"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _types_1 = require("../@types");
const utils_1 = require("../utils");
const payments_1 = __importDefault(require("../validations/payments"));
const { apiResponse } = utils_1.Toolbox;
const PaymentMiddleware = {
    async inspectMakePayment(req, res, next) {
        try {
            await payments_1.default.validatePayment(req.body);
            next();
        }
        catch (error) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.BAD_REQUEST, _types_1.ResponseCode.VALIDATION_ERROR, {}, error);
        }
    },
    async inspectWithdraw(req, res, next) {
        try {
            await payments_1.default.validateWithdraw(req.body);
            next();
        }
        catch (error) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.BAD_REQUEST, _types_1.ResponseCode.VALIDATION_ERROR, {}, error);
        }
    },
};
exports.default = PaymentMiddleware;
