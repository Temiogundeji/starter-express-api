import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/User';
import { ResponseCode, ResponseType, StatusCode } from '../../@types';
import { Toolbox } from '../../utils';

const { apiResponse } = Toolbox;

async function resetPin(req: Request, res: Response) {
  try {
    let appUser = req.user as any;
    const { pin, newPin } = req.body;

    if (!bcrypt.compareSync(String(pin), appUser.pin)) {
      throw new Error('Invalid credentials');
    }

    await User.updateOne(
      { _id: appUser.id },
      { pin: bcrypt.hashSync(String(newPin), 10) },
      { runValidators: true }
    );
    res.send({ success: true });
    // return apiResponse(
    //   res,
    //   ResponseType.SUCCESS,
    //   StatusCode.OK,
    //   ResponseCode.SUCCESS,
    //   'Success message string.'
    // );
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

export default resetPin;
