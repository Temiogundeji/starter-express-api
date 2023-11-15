import { Request, Response } from 'express';
import { ResponseCode, ResponseType, StatusCode } from '../../@types';
import { Toolbox } from '../../utils';
import { Users } from '../../services';
import { User } from '../../models';

const { apiResponse } = Toolbox;

async function getUser(req: Request, res: Response) {
  try {
    const appUser = req.user as any;
    // const userDetails: any = await Users.getUserById(appUser._id);
    const [user] = await User.aggregate([
      {
        $match: {
          _id: appUser._id
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
    return apiResponse(
      res,
      ResponseType.SUCCESS,
      StatusCode.OK,
      ResponseCode.SUCCESS,
      user as object
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

export default getUser;
