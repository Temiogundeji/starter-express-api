"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
async function verifyToken(req, res) {
    try {
        const { token } = req.query;
        const { email } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = (await User_1.default.findOne({ email }));
        if (user.isActive) {
            return res.sendFile(path_1.default.join(__dirname, '../../templates/validate2.html'));
        }
        user.isActive = true;
        user.hasLoggedIn = true;
        await user.save();
        res.sendFile(path_1.default.join(__dirname, '../../templates/validate.html'));
    }
    catch (error) {
        res.sendFile(path_1.default.join(__dirname, '../../templates/fail.html'));
    }
}
exports.default = verifyToken;
