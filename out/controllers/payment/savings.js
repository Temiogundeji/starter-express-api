"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const _types_1 = require("../../@types");
const { apiResponse } = utils_1.Toolbox;
const Wallets_1 = __importDefault(require("../../services/Wallets"));
const logger_1 = __importDefault(require("../../config/logger"));
async function saveMoney(req, res) {
    const { amount, description, type } = req.body;
    try {
        const user = req.user;
        if (!user) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.NOT_FOUND, _types_1.ResponseCode.FAILURE, "User not found");
        }
        const savingsRes = await Wallets_1.default.save(user, amount, description, type);
        console.log(savingsRes, "SAVINGS RESPONSE HERE");
        (0, logger_1.default)("SAVINGS RESPONSE", savingsRes);
        return apiResponse(res, _types_1.ResponseType.SUCCESS, _types_1.StatusCode.OK, _types_1.ResponseCode.SUCCESS, {
            ...savingsRes,
            type
        });
    }
    catch (e) {
        return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.INTERNAL_SERVER_ERROR, _types_1.ResponseCode.FAILURE, {}, `looks like something went wrong: ${JSON.stringify(e.message || e)} `);
    }
}
exports.default = saveMoney;
