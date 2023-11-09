"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_1 = __importDefault(require("../controllers/post"));
const post_2 = __importDefault(require("../middlewares/post"));
const router = express_1.default.Router();
router.post("/", post_2.default.inspectPost, post_1.default.postArticle);
exports.default = router;
