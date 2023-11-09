"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const genToken_1 = __importDefault(require("./genToken"));
const login_1 = __importDefault(require("./login"));
const newPassword_1 = __importDefault(require("./newPassword"));
const resendEmail_1 = __importDefault(require("./resendEmail"));
const signup_1 = __importDefault(require("./signup"));
const verifyToken_1 = __importDefault(require("./verifyToken"));
const softDeleteUser_1 = __importDefault(require("./softDeleteUser"));
const AuthController = {
    genToken: genToken_1.default,
    login: login_1.default,
    newPassword: newPassword_1.default,
    resendEmail: resendEmail_1.default,
    signup: signup_1.default,
    verifyToken: verifyToken_1.default,
    softDeleteUser: softDeleteUser_1.default,
};
exports.default = AuthController;
