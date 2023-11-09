"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const AppError_1 = require("../exceptions/AppError");
class UserService {
    async createUser(userData) {
        try {
            const user = new User_1.default(userData);
            await user.save();
            return user;
        }
        catch (error) {
            throw new AppError_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error creating user"
            });
        }
    }
    async getUserById(userId) {
        try {
            const user = await User_1.default.findById({ _id: userId });
            if (!user)
                throw new Error('User not found');
            return user;
        }
        catch (error) {
            throw new AppError_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: "User not found"
            });
        }
    }
    async getUserByEmail(email) {
        try {
            const user = User_1.default.findOne({ email });
            if (!user)
                throw new Error('User not found');
            return user;
        }
        catch (error) {
            throw new AppError_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: "User not found"
            });
        }
    }
    async updateUser(userId, userData) {
        try {
            const user = await User_1.default.findByIdAndUpdate(userId, userData, {
                new: true,
            });
            if (!user)
                throw new Error('User not found');
            return user;
        }
        catch (error) {
            throw new AppError_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: "User not found"
            });
        }
    }
    async deleteUser(userId) {
        try {
            const user = await User_1.default.findByIdAndDelete({ id: userId });
            if (!user)
                throw new Error('User not found');
            return user;
        }
        catch (error) {
            throw new AppError_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: "User not found"
            });
        }
    }
}
exports.default = new UserService();
