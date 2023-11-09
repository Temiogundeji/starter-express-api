import { ObjectId } from "mongoose";
import { IPost } from "../@types/post";
import { AppError } from "../utils";
import { HttpCode } from "../exceptions/AppError";
import Post from "../models/Post";
import { log } from "winston";

class PostService {
    async createPost(postObj: IPost) {
        try {
            const post = await Post.create(postObj);
            return post;
        }
        catch (error) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error creating post"
            }
            );
        }
    }
    async getPosts(id: ObjectId) {
        try {
            const posts = await Post.findAll();
            return posts;
        } catch (error) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error creating post"
            }
            );
        }
    }
    async getAPost(id: string) {
        try {
            const post = await Post.find({ id });
            log(`Tranaction for ${id}`, post);
            return post;
        }
        catch (error) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error creating user"
            }
            );
        }
    }
    async getAPostByTitle(title:string) {
        try {
            const post = await Post.find({ title });
            log(`Transaction for ${title}`, post);
            return post;
        }
        catch (error) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error creating user"
            }
            );
        }
    }
}

export default new PostService();