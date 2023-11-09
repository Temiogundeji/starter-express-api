"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mailer_1 = __importDefault(require("../../utils/mailer"));
const models_1 = require("../../models");
const RefreshToken_1 = __importDefault(require("../../models/auth/RefreshToken"));
const config_1 = require("../../config");
const _types_1 = require("../../@types");
const utils_1 = require("../../utils");
const helpers_1 = require("../../utils/helpers");
const { apiResponse } = utils_1.Toolbox;
const userHtml = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../templates/welcome.html'), {
    encoding: 'utf-8',
});
const signUpHTML = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../templates/signup.html'), {
    encoding: 'utf-8',
});
async function login(req, res) {
    const { email } = req.body;
    try {
        const [user] = await models_1.User.aggregate([
            {
                $match: {
                    email: email
                }
            },
            {
                $lookup: {
                    from: "roles",
                    localField: "roles",
                    foreignField: "_id",
                    as: "userRoles",
                    pipeline: [
                        {
                            $project: {
                                userRoles: 0,
                                id: 0
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "wallets",
                    localField: "_id",
                    foreignField: "userId",
                    as: "wallet"
                }
            },
            {
                $unwind: "$wallet"
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    password: 1,
                    phoneNumber: 1,
                    accountNumber: 1,
                    staffId: 1,
                    gender: 1,
                    staffType: 1,
                    isActive: 1,
                    userRoles: 1,
                    hasLoggedIn: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    wallet: {
                        _id: 1,
                        balance: 1,
                        createdAt: 1,
                        updatedAt: 1
                    },
                }
            }
        ]);
        if (!user) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.NOT_FOUND, _types_1.ResponseCode.FAILURE, 'User not found.');
        }
        const passwordIsValid = bcrypt_1.default.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.UNAUTHORIZED, _types_1.ResponseCode.FAILURE, 'User not authorized.');
        }
        if (user && user.isActive === true) {
            await (0, mailer_1.default)(user.email, 'Welcome to FPI Muslim Community Coperative!', userHtml.replace(`{{NAME}}`, `${user.firstName}`));
        }
        if (!user?.isActive) {
            const tempToken = (0, helpers_1.generateAccessToken)(req.body.email, true);
            const redirectUrl = config_1.env.environment === "production" ?
                `${req.protocol}s://${req.get("host")}/mcics/api/v1/auth/verify?token=${tempToken}`
                : `${req.protocol}://${req.get("host")}/mcics/api/v1/auth/verify?token=${tempToken}`;
            await (0, mailer_1.default)(req.body.email, 'Verify your FPI MCICS account', signUpHTML.replace('{{NAME}}', `${user.firstName}`).replace('{{LINK}}', redirectUrl));
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.UNAUTHORIZED, _types_1.ResponseCode.FAILURE, 'Please verify your account by clicking the link we have sent to your email');
        }
        const accessToken = (0, helpers_1.generateAccessToken)(req.body.email, false);
        const refreshToken = await RefreshToken_1.default.createToken(user);
        const authorities = user.userRoles.map((role) => "ROLE_" + role.name?.toUpperCase());
        const { password, id, userRoles, ...rest } = user;
        return apiResponse(res, _types_1.ResponseType.SUCCESS, _types_1.StatusCode.OK, _types_1.ResponseCode.SUCCESS, {
            ...rest,
            roles: authorities,
            accessToken,
            refreshToken
        });
    }
    catch (err) {
        return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.INTERNAL_SERVER_ERROR, _types_1.ResponseCode.FAILURE, {}, `looks like something went wrong: ${JSON.stringify(err.message || err)} `);
    }
}
exports.default = login;
