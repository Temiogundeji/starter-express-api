"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../../models/User"));
const _types_1 = require("../../@types");
const utils_1 = require("../../utils");
const { apiResponse } = utils_1.Toolbox;
async function newPassword(req, res) {
    try {
        const { password, tempToken, email } = req.body;
        if (!password)
            throw new Error('Please include password');
        const user = await User_1.default.findOneAndUpdate({ email, tempToken }, { pin: bcrypt_1.default.hashSync(String(password), 10) }, { new: true, runValidators: true });
        if (!user)
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.NOT_FOUND, _types_1.ResponseCode.FAILURE, 'user not found');
        return apiResponse(res, _types_1.ResponseType.SUCCESS, _types_1.StatusCode.OK, _types_1.ResponseCode.SUCCESS, 'Password updated successfully.');
    }
    catch (error) {
        return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.INTERNAL_SERVER_ERROR, _types_1.ResponseCode.FAILURE, {}, `looks like something went wrong: ${JSON.stringify(error)} `);
    }
}
exports.default = newPassword;
