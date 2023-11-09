"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const savings_1 = __importDefault(require("../controllers/payment/savings"));
const transactions_1 = __importDefault(require("../controllers/transactions"));
const payment_1 = __importDefault(require("../middlewares/payment"));
const withdraw_1 = __importDefault(require("../controllers/payment/withdraw"));
const { inspectMakePayment, inspectWithdraw } = payment_1.default;
const router = express_1.default.Router();
router.post("/save", inspectMakePayment, savings_1.default);
router.post("/withdraw", inspectWithdraw, withdraw_1.default);
router.get("/:walletId/transactions", transactions_1.default.fetchWalletTransactions);
router.post("");
exports.default = router;
