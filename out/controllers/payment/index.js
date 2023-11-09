"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const savings_1 = __importDefault(require("./savings"));
const withdraw_1 = __importDefault(require("./withdraw"));
const PostController = {
    savings: savings_1.default,
    withdrawMoney: withdraw_1.default
};
exports.default = PostController;
