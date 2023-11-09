import { Request, Response } from 'express';
import { ResponseCode, ResponseType, StatusCode } from '../../@types';
import { Toolbox } from '../../utils';

const { apiResponse } = Toolbox;


async function firebaseToken(req: Request, res: Response) {
  try {
    const { firebaseToken } = req.body as any;
    if (!firebaseToken)
      return res.status(400).send({ success: false, message: 'Token is required' });

    let user = req.user as any;

    user.firebaseToken = firebaseToken;
    await user.save();
    res.status(200).send({ success: true });
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

export default firebaseToken;
