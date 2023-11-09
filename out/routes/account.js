"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const acount_1 = __importDefault(require("../middlewares/acount"));
const utils_1 = __importDefault(require("../controllers/payment/utils"));
router.get('/resolve', acount_1.default, utils_1.default);
exports.default = router;
