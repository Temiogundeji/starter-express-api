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

async function postArticle(req: Request, res: Response) {
    const { author, title, body } = req.body;
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

        const isPostExist = await Posts.getAPostByTitle(title);
        if (isPostExist) {
            return apiResponse(
                res,
                ResponseType.FAILURE,
                StatusCode.BAD_REQUEST,
                ResponseCode.FAILURE,
                "Post already exist"
            );
        }

        const newPost = await Posts.createPost({ author, title, body });
        const users = await User.find();

        await Promise.allSettled(
            [...users].map(
                async (user: any) => {
                    await mailer(
                        [user?.email],
                        `${user?.firstName}, You have a new notification 🛎️, check your App!!`,
                        postHtml.replaceAll(`{{NAME}}`, user?.firstName)
                            .replaceAll(
                                `{{POST_TITLE}}`,
                                newPost.title
                            )
                    );

                }
            )
        );

        return apiResponse(res, ResponseType.SUCCESS, StatusCode.OK, ResponseCode.SUCCESS, {
            post: newPost
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


export default postArticle;