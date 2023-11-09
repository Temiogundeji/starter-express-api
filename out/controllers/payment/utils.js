"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Payments_1 = __importDefault(require("../../services/Payments"));
const _types_1 = require("../../@types");
const utils_1 = require("../../utils");
const AppError_1 = require("../../exceptions/AppError");
const utils_2 = require("../../utils");
const { apiResponse } = utils_2.Toolbox;
async function resolveAccountNumber(req, res) {
    const { accountNumber, bank } = req.body;
    try {
        const accountResponse = await Payments_1.default.resolveAccountNumber(accountNumber, bank);
        return apiResponse(res, _types_1.ResponseType.SUCCESS, _types_1.StatusCode.OK, _types_1.ResponseCode.SUCCESS, {
            ...accountResponse,
        });
    }
    catch (e) {
        throw new utils_1.AppError({
            httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
            description: e.message
        });
    }
}
exports.default = resolveAccountNumber;
