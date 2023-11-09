"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mailer_1 = __importDefault(require("../../utils/mailer"));
const User_1 = __importDefault(require("../../models/User"));
const Wallet_1 = __importDefault(require("../../models/Wallet"));
const auth_1 = __importDefault(require("../../models/auth"));
const _types_1 = require("../../@types");
const utils_1 = require("../../utils");
const services_1 = require("../../services/");
const helpers_1 = require("../../utils/helpers");
const config_2 = require("../../config");
const { apiResponse } = utils_1.Toolbox;
const { APP_BASE_URL } = config_1.env;
const signUpHTML = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../templates/signup.html'), {
    encoding: 'utf-8',
});
async function signup(req, res) {
    try {
        const { firstName, lastName, email, roles, phoneNumber, staffId, password, gender, accountNumber, staffType } = req.body;
        const existingUser = await services_1.Users.getUserByEmail(email);
        if (existingUser) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.ALREADY_EXISTS, _types_1.ResponseCode.FAILURE, {}, 'User already exists');
        }
        const newUser = await User_1.default.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            roles: roles,
            phoneNumber: phoneNumber,
            staffId: staffId,
            password: bcrypt_1.default.hashSync(password, 10),
            gender: gender,
            accountNumber: accountNumber,
            staffType: staffType,
        });
        await Wallet_1.default.create({ userId: newUser._id });
        if (req.body.roles && req.body.roles.length > 0) {
            const roles = await auth_1.default.Role.find({
                name: { $in: req.body.roles },
            });
            newUser.roles = roles.map((role) => role.id);
        }
        else {
            const defaultRole = await auth_1.default.Role.findOne({ name: "user" });
            newUser.roles = [defaultRole.id];
            await newUser.save();
        }
        await newUser.save();
        const accessToken = (0, helpers_1.generateAccessToken)(email, false);
        const redirectUrl = `${req.protocol}s://${req.get("host")}/users/verify?token=${accessToken}`;
        await (0, mailer_1.default)(req.body.email, 'Verify your Muslim Community Cooperative Account', signUpHTML.replace('{{NAME}}', `${firstName}`).replace('{{LINK}}', redirectUrl));
        (0, config_2.logger)('redirect url', redirectUrl);
        return apiResponse(res, _types_1.ResponseType.SUCCESS, _types_1.StatusCode.OK, _types_1.ResponseCode.SUCCESS, 'Registration successful.');
    }
    catch (error) {
        return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.INTERNAL_SERVER_ERROR, _types_1.ResponseCode.FAILURE, {}, `Looks like something went wrong: ${error.message}`);
    }
}
exports.default = signup;
