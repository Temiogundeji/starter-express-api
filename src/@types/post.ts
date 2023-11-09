import { ObjectId } from "mongoose";

export interface IPost {
    author: ObjectId,
    title: string,
    body: string
}