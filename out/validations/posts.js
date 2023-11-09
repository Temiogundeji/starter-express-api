"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const date_1 = __importDefault(require("@joi/date"));
const joi = joi_1.default.extend(date_1.default);
const post = {
    async validatePost(payload) {
        const schema = joi.object({
            author: joi.string().required().label('Author is required'),
            title: joi.string().required().label('Title is required'),
            body: joi.string().required().label('Body is required')
        });
        const { error } = schema.validate(payload);
        if (error)
            throw error.details[0].context.label;
        return true;
    }
};
exports.default = post;
