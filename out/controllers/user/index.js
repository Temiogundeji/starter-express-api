"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getUser_1 = __importDefault(require("./getUser"));
const resetPin_1 = __importDefault(require("./resetPin"));
const upload_1 = __importDefault(require("./upload"));
const UserController = {
    getUser: getUser_1.default,
    resetPin: resetPin_1.default,
    upload: upload_1.default,
};
exports.default = UserController;
