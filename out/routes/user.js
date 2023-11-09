"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const user_1 = __importDefault(require("../controllers/user"));
const router = express_1.default.Router();
const { upload, getUser, resetPin, } = user_1.default;
router.get('/me', getUser);
router.post('/reset', resetPin);
router.post('/upload', middlewares_1.Uploader.single('image'), upload);
exports.default = router;
