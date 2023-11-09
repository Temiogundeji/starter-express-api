"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const _types_1 = require("../../@types");
const Chat_1 = __importDefault(require("../../services/Chat"));
const { apiResponse } = utils_1.Toolbox;
async function ChatAssistant(req, res) {
    const { content } = req.body;
    if (!content) {
        throw new Error("Content is required");
    }
    try {
        const user = req.user;
        if (!user) {
            return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.NOT_FOUND, _types_1.ResponseCode.FAILURE, "User not found");
        }
        const chatResponse = await (0, Chat_1.default)(content);
        return apiResponse(res, _types_1.ResponseType.SUCCESS, _types_1.StatusCode.OK, _types_1.ResponseCode.SUCCESS, {
            chatResponse
        });
    }
    catch (e) {
        return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.INTERNAL_SERVER_ERROR, _types_1.ResponseCode.FAILURE, {}, `looks like something went wrong: ${JSON.stringify(e.message || e)} `);
    }
}
exports.default = ChatAssistant;
