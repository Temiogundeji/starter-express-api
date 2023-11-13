import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import mailer from '../../utils/mailer';
import { User } from '../../models';
import RefreshToken from '../../models/auth/RefreshToken';
import { env } from '../../config';
import { ResponseCode, ResponseType, StatusCode } from '../../@types';
import { Toolbox } from "../../utils";
import { generateAccessToken } from '../../utils/helpers';

const { apiResponse } = Toolbox;

const userHtml = fs.readFileSync(path.join(__dirname, '../../templates/welcome.html'), {
    encoding: 'utf-8',
});

const signUpHTML = fs.readFileSync(path.join(__dirname, '../../templates/signup.html'), {
    encoding: 'utf-8',
});

async function login(req: Request, res: Response) {
    const { email } = req.body;
    try {
        const [user] = await User.aggregate([
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
            return apiResponse(
                res,
                ResponseType.FAILURE,
                StatusCode.NOT_FOUND,
                ResponseCode.FAILURE,
                'User not found.'
            );
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return apiResponse(
                res,
                ResponseType.FAILURE,
                StatusCode.UNAUTHORIZED,
                ResponseCode.FAILURE,
                'User not authorized.'
            );
        }

        if (user && user.isActive === true) {
            await mailer(
                user.email,
                'Welcome to FPI Muslim Community Coperative!',
                userHtml.replace(`{{NAME}}`, `${user.firstName}`)
            );
        }

        if (!user?.isActive) {

            const tempToken = generateAccessToken(req.body.email, true)

            const redirectUrl = env.environment === "production" ?
                `${req.protocol}s://${req.get("host")}/mcics/api/v1/auth/verify?token=${tempToken}`
                : `${req.protocol}://${req.get("host")}/mcics/api/v1/auth/verify?token=${tempToken}`
            await mailer(
                req.body.email,
                'Verify your FPI MCICS account',
                signUpHTML.replace('{{NAME}}', `${user.firstName}`).replace('{{LINK}}', redirectUrl)
            );

            return apiResponse(
                res,
                ResponseType.FAILURE,
                StatusCode.UNAUTHORIZED,
                ResponseCode.FAILURE,
                'Please verify your account by clicking the link we have sent to your email'
            );
        }


        const accessToken = generateAccessToken(req.body.email, false);
        const refreshToken = await RefreshToken.createToken(user);

        const authorities = user?.userRoles.map(
            (role: any) => "ROLE_" + role.name?.toUpperCase()
        );
        const { password, id, userRoles, ...rest } = user;

        return apiResponse(res, ResponseType.SUCCESS, StatusCode.OK, ResponseCode.SUCCESS, {
            ...rest,
            roles: authorities,
            accessToken,
            refreshToken
        });
    } catch (err: any) {
        return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.INTERNAL_SERVER_ERROR,
            ResponseCode.FAILURE,
            {},
            `looks like something went wrong: ${JSON.stringify(err.message || err)} `
        );
    }
}

export default login;
