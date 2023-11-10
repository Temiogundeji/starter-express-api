import { Request, Response } from 'express';
import { env } from '../../config';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import mailer from '../../utils/mailer';
import User from '../../models/User';
import Wallet from '../../models/Wallet';
import auth from '../../models/auth';
import { ResponseCode, ResponseType, StatusCode } from '../../@types';
import { Toolbox } from '../../utils';
import { Users } from '../../services/';
import { generateAccessToken } from '../../utils/helpers';
import { logger } from '../../config';

const { apiResponse } = Toolbox;
const { APP_BASE_URL } = env;

const signUpHTML = fs.readFileSync(path.join(__dirname, '../../templates/signup.html'), {
  encoding: 'utf-8',
});

async function signup(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, roles, phoneNumber, staffId, password, gender, accountNumber, staffType } = req.body as any;
    const existingUser = await Users.getUserByEmail(email);

    if (existingUser) {
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.ALREADY_EXISTS,
        ResponseCode.FAILURE,
        {},
        'User already exists'
      );
    }

    const newUser = await User.create(
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        roles: roles,
        phoneNumber: phoneNumber,
        staffId: staffId,
        password: bcrypt.hashSync(password, 10),
        gender: gender,
        accountNumber: accountNumber,
        staffType: staffType,
      }
    );

    const newUserObj = newUser.toObject();

    await Wallet.create({ userId: newUserObj._id });


    if (req.body.roles && req.body.roles.length > 0) {
      const roles = await auth.Role.find({
        name: { $in: req.body.roles },
      });

      newUser.roles = roles.map((role: any) => role._id);
    } else {
      const defaultRole = await auth.Role.findOne({ name: "user" });
      newUser.roles = [defaultRole.id];
      await newUser.save();
    }
    await newUser.save();
    const accessToken = generateAccessToken(email, false)
    const redirectUrl = `${req.protocol}s://${req.get("host")}/users/verify?token=${accessToken}`

    await mailer(
      req.body.email,
      'Verify your Muslim Community Cooperative Account',
      signUpHTML.replace('{{NAME}}', `${firstName}`).replace('{{LINK}}', redirectUrl)
    );

    logger('redirect url', redirectUrl);

    return apiResponse(
      res,
      ResponseType.SUCCESS,
      StatusCode.OK,
      ResponseCode.SUCCESS,
      'Registration successful.'
    );
  } catch (error: any) {
    return apiResponse(
      res,
      ResponseType.FAILURE,
      StatusCode.INTERNAL_SERVER_ERROR,
      ResponseCode.FAILURE,
      {},
      `Looks like something went wrong: ${error.message}`

    );
  }
}

export default signup;
