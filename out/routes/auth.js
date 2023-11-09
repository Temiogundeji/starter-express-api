"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../controllers/auth"));
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
const { signup, login, genToken, newPassword, verifyToken, resendEmail, softDeleteUser } = auth_1.default;
const { inspectRegisterUser, inspectAuthRoutes, inspectVerifyToken, inspectToggleActivationStatus, } = middlewares_1.UserMiddleware;
router.post('/signup', inspectRegisterUser, signup);
router.post('/login', inspectAuthRoutes, login);
router.post('/token', inspectAuthRoutes, genToken);
router.post('/password', inspectAuthRoutes, newPassword);
router.post('/login/resend', inspectAuthRoutes, resendEmail);
router.get('/verify', inspectVerifyToken, verifyToken);
router.patch('/status', inspectToggleActivationStatus, softDeleteUser);
exports.default = router;
