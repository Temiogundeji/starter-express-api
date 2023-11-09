"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchTransactionsById_1 = __importDefault(require("./fetchTransactionsById"));
const fetchWalletTransactions_1 = __importDefault(require("./fetchWalletTransactions"));
const AuthController = {
    fetchWalletTransactions: fetchWalletTransactions_1.default,
    fetchTransactionsById: fetchTransactionsById_1.default
};
exports.default = AuthController;
