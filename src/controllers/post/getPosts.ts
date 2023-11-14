import { Request, Response } from "express";
import { Toolbox } from "../../utils";
import path from "path";
import fs from "fs";

import { ResponseCode, ResponseType, StatusCode } from "../../@types";
import Posts from "../../services/Posts";

const { apiResponse } = Toolbox;
import { logger } from "../../config";
import mailer from '../../utils/mailer';
import { User } from "../../models";

const postHtml = fs.readFileSync(path.join(__dirname, '../../templates/post.html'), {
    encoding: 'utf-8',
});

async function getPosts(req: Request, res: Response) {
    try {
        const user = req.user;
        if (!user) {
            return apiResponse(
                res,
                ResponseType.FAILURE,
                StatusCode.NOT_FOUND,
                ResponseCode.FAILURE,
                "User not found"
            );
        }

        const posts = await Posts.getPosts();
        console.log(posts, "ALL POSTS")


        return apiResponse(res, ResponseType.SUCCESS, StatusCode.OK, ResponseCode.SUCCESS, {
            post: posts
        })
    }
    catch (e: any) {
        return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.INTERNAL_SERVER_ERROR,
            ResponseCode.FAILURE,
            {},
            `looks like something went wrong: ${JSON.stringify(e.message || e)} `
        );
    }
}


export default getPosts;