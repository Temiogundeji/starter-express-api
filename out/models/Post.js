"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Author information is required"]
    },
    title: {
        type: String,
        required: [true, "Post title is required"]
    },
    body: {
        type: String,
        require: [true, "Post body is required"]
    }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true });
exports.default = mongoose.model("Post", PostSchema);
