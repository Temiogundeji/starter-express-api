import { Request, Response } from 'express';
import { ResponseCode, ResponseType, StatusCode, IUser } from '../../@types';
import { Toolbox } from '../../utils';
import { Users } from '../../services';

const { apiResponse } = Toolbox;

async function softDeleteUser(req: Request, res: Response) {
  try {
    const { deactivate, id } = req.body;
    const appUser: any = await Users.getUserById(id);

    if (!appUser) {
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.BAD_REQUEST,
        ResponseCode.FAILURE,
        {},
        'User not found'
      );
    }

    if (appUser?.isDeleted?.status && deactivate)
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.BAD_REQUEST,
        ResponseCode.FAILURE,
        {},
        'This account is already marked for deleting.'
      );

    await Users.updateUser(appUser?._id, {
      isDeleted: {
        status: deactivate,
        date: new Date(),
      },
    } as unknown as IUser);

    return apiResponse(
      res,
      ResponseType.SUCCESS,
      StatusCode.OK,
      ResponseCode.SUCCESS,
      deactivate ? 'This account will be deleted in 30days.' : 'This account is restored.'
    );
  } catch (error) {
    console.log(error);
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

export default softDeleteUser;
