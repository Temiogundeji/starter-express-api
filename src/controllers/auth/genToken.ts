import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import mailer from '../../utils/mailer';
import User from '../../models/User';
import { ResponseCode, ResponseType, StatusCode } from '../../@types';
import { Toolbox } from '../../utils';
import { generateAuthToken } from '../../utils/helpers';

const { apiResponse } = Toolbox;

const resetBody = fs.readFileSync(path.join(__dirname, '/../../templates/user.html'), {
  encoding: 'utf-8',
});

async function genToken(req: Request, res: Response) {
  try {
    const tempToken = generateAuthToken(5);

    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { tempToken },
      { new: true, runValidators: true }
    );
    if (!user)
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.NOT_FOUND,
        ResponseCode.FAILURE,
        'user not found'
      );
    await mailer(
      req.body.email,
      'Password Reset',
      resetBody
        .replace(`{{TOKEN}}`, `${tempToken}`)
        .replace('{{TITLE}}', 'This is your password reset token')
    );
    return apiResponse(res, ResponseType.SUCCESS, StatusCode.OK, ResponseCode.SUCCESS, tempToken);
  } catch (error) {
    return apiResponse(
      res,
      ResponseType.FAILURE,
      StatusCode.INTERNAL_SERVER_ERROR,
      ResponseCode.FAILURE,
      {},
      `looks like something went wrong: ${JSON.stringify(error)} `
    );
  }
}

export default genToken;
