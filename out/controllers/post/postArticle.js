"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const _types_1 = require("../../@types");
const Posts_1 = __importDefault(require("../../services/Posts"));
const { apiResponse } = utils_1.Toolbox;
const mailer_1 = __importDefault(require("../../utils/mailer"));
const models_1 = require("../../models");
const postHtml = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../templates/post.html'), {
    encoding: 'utf-8',
});
async function postArticle(req, res) {
    const { author, title, body } = req.body;
    try {
        const user = req.user;
        if (!user) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.NOT_FOUND, _types_1.ResponseCode.FAILURE, "User not found");
        }
        const isPostExist = await Posts_1.default.getAPostByTitle(title);
        if (isPostExist) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.BAD_REQUEST, _types_1.ResponseCode.FAILURE, "Post already exist");
        }
        const newPost = await Posts_1.default.createPost({ author, title, body });
        const users = await models_1.User.find();
        await Promise.allSettled([...users].map(async (user) => {
            await (0, mailer_1.default)([user?.email], `${user?.firstName}, You have a new notification 🛎️, check your App!!`, postHtml.replaceAll(`{{NAME}}`, user?.firstName)
                .replaceAll(`{{POST_TITLE}}`, newPost.title));
        }));
        return apiResponse(res, _types_1.ResponseType.SUCCESS, _types_1.StatusCode.OK, _types_1.ResponseCode.SUCCESS, {
            post: newPost
        });
    }
    catch (e) {
        return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.INTERNAL_SERVER_ERROR, _types_1.ResponseCode.FAILURE, {}, `looks like something went wrong: ${JSON.stringify(e.message || e)} `);
    }
}
exports.default = postArticle;
