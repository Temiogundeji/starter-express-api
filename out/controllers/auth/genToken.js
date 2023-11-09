"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mailer_1 = __importDefault(require("../../utils/mailer"));
const User_1 = __importDefault(require("../../models/User"));
const _types_1 = require("../../@types");
const utils_1 = require("../../utils");
const helpers_1 = require("../../utils/helpers");
const { apiResponse } = utils_1.Toolbox;
const resetBody = fs_1.default.readFileSync(path_1.default.join(__dirname, '/../../templates/user.html'), {
    encoding: 'utf-8',
});
async function genToken(req, res) {
    try {
        const tempToken = (0, helpers_1.generateAuthToken)(5);
        const user = await User_1.default.findOneAndUpdate({ email: req.body.email }, { tempToken }, { new: true, runValidators: true });
        if (!user)
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.NOT_FOUND, _types_1.ResponseCode.FAILURE, 'user not found');
        await (0, mailer_1.default)(req.body.email, 'Password Reset', resetBody
            .replace(`{{TOKEN}}`, `${tempToken}`)
            .replace('{{TITLE}}', 'This is your password reset token'));
        return apiResponse(res, _types_1.ResponseType.SUCCESS, _types_1.StatusCode.OK, _types_1.ResponseCode.SUCCESS, tempToken);
    }
    catch (error) {
        return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.INTERNAL_SERVER_ERROR, _types_1.ResponseCode.FAILURE, {}, `looks like something went wrong: ${JSON.stringify(error)} `);
    }
}
exports.default = genToken;
