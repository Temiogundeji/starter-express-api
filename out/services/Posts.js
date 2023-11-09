"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const AppError_1 = require("../exceptions/AppError");
const Post_1 = __importDefault(require("../models/Post"));
const winston_1 = require("winston");
class PostService {
    async createPost(postObj) {
        try {
            const post = await Post_1.default.create(postObj);
            return post;
        }
        catch (error) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error creating post"
            });
        }
    }
    async getPosts(id) {
        try {
            const posts = await Post_1.default.findAll();
            return posts;
        }
        catch (error) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error creating post"
            });
        }
    }
    async getAPost(id) {
        try {
            const post = await Post_1.default.find({ id });
            (0, winston_1.log)(`Tranaction for ${id}`, post);
            return post;
        }
        catch (error) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error creating user"
            });
        }
    }
    async getAPostByTitle(title) {
        try {
            const post = await Post_1.default.find({ title });
            (0, winston_1.log)(`Transaction for ${title}`, post);
            return post;
        }
        catch (error) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error creating user"
            });
        }
    }
}
exports.default = new PostService();
