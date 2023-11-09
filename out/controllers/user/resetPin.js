"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../../models/User"));
const _types_1 = require("../../@types");
const utils_1 = require("../../utils");
const { apiResponse } = utils_1.Toolbox;
async function resetPin(req, res) {
    try {
        let appUser = req.user;
        const { pin, newPin } = req.body;
        if (!bcryptjs_1.default.compareSync(String(pin), appUser.pin)) {
            throw new Error('Invalid credentials');
        }
        await User_1.default.updateOne({ _id: appUser.id }, { pin: bcryptjs_1.default.hashSync(String(newPin), 10) }, { runValidators: true });
        res.send({ success: true });
        // return apiResponse(
        //   res,
        //   ResponseType.SUCCESS,
        //   StatusCode.OK,
        //   ResponseCode.SUCCESS,
        //   'Success message string.'
        // );
    }
    catch (error) {
        return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.INTERNAL_SERVER_ERROR, _types_1.ResponseCode.FAILURE, {}, `looks like something went wrong: ${JSON.stringify(error)} `);
    }
}
exports.default = resetPin;
