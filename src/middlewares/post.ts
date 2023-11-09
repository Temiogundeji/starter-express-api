import { Request, Response, NextFunction } from 'express';
import { RegisterType, ResponseCode, StatusCode, ResponseType } from '../@types';
import { Toolbox } from '../utils';
import postValidations from '../validations/posts';

const { apiResponse } = Toolbox;

const PostMiddleware = {
    async inspectPost(req: Request, res: Response, next: NextFunction) {
        try {
            await postValidations.validatePost(req.body);
            next();
        }
        catch (error) {
            return apiResponse(
                res,
                ResponseType.FAILURE,
                StatusCode.BAD_REQUEST,
                ResponseCode.VALIDATION_ERROR,
                {},
                error as string
            );
        }
    }
}

export default PostMiddleware;