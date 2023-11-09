import { Request, Response } from 'express';
import { ResponseCode, ResponseType, StatusCode, IUser } from '../../@types';
import { Toolbox } from '../../utils';
import { Users } from '../../services';

const { apiResponse } = Toolbox;

async function upload(req: Request, res: Response) {
  try {
    const appUser = req.user as any;

    const image = req.file?.path ? req.file?.path : '';

    if (!image)
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.BAD_REQUEST,
        ResponseCode.FAILURE,
        {},
        'Image upload failed. Please try again.'
      );

    const updatedUser = await Users.updateUser(appUser._id, { image } as IUser);

    return apiResponse(
      res,
      ResponseType.SUCCESS,
      StatusCode.OK,
      ResponseCode.SUCCESS,
      updatedUser as object
    );
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

export default upload;
