"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
// import mailer from '../../utils/mailer';
const User_1 = __importDefault(require("../../models/User"));
const _types_1 = require("../../@types");
const utils_1 = require("../../utils");
const { apiResponse } = utils_1.Toolbox;
const verifyHtml = fs_1.default.readFileSync(path_1.default.join(__dirname, '/../../templates/signup.html'), {
    encoding: 'utf-8',
});
async function resendEmail(req, res) {
    try {
        let user = await User_1.default.findOne({
            email: req.body.email,
        });
        if (!user) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.NOT_FOUND, _types_1.ResponseCode.FAILURE, 'User not found.');
        }
        if (!user?.isActive) {
            user.expiresIn = new Date(new Date().setDate(new Date().getDate() + 7));
            await user.save();
            const tempToken = jsonwebtoken_1.default.sign({ email: req.body.email }, process.env.JWT_SECRET, {
                expiresIn: '7d',
            });
            const redirect = `${req.protocol}s://${req.get('host')}/users/verify`;
            const redirectUrl = new URL(redirect);
            redirectUrl.searchParams.append('token', tempToken);
            // await mailer(
            //   req.body.email,
            //   'Verify your MCICS account',
            //   verifyHtml
            //     .replace(`{{NAME}}`, `${user.firstName}`)
            //     .replace('{{LINK}}', redirectUrl.toString())
            // );
        }
        return apiResponse(res, _types_1.ResponseType.SUCCESS, _types_1.StatusCode.OK, _types_1.ResponseCode.SUCCESS, 'Email sent.');
    }
    catch (error) {
        return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.INTERNAL_SERVER_ERROR, _types_1.ResponseCode.FAILURE, {}, `looks like something went wrong: ${JSON.stringify(error)} `);
    }
}
exports.default = resendEmail;
