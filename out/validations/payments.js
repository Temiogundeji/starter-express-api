"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const date_1 = __importDefault(require("@joi/date"));
const joi = joi_1.default.extend(date_1.default);
const payment = {
    async validatePayment(payload) {
        const schema = joi.object({
            amount: joi.number().min(5000).required().label('Amount must not be less than 5000'),
            description: joi.string().required().label('Description is required'),
            type: joi.string().required().valid('savings', 'withdrawal')
        });
        const { error } = schema.validate(payload);
        if (error)
            throw error.details[0].context.label;
        return true;
    },
    async validateWithdraw(payload) {
        const schema = joi.object({
            walletId: joi.string().required().label('WalletId is required'),
            accountNumber: joi.string().max(15).required().label('Account number must not be greater than 15 digits'),
            amount: joi.number().min(1000).required().label('Amount must not be less than 1000'),
            activityType: joi.string().required().valid('Savings', 'withdrawal'),
            reason: joi.string().required().label('Reason is required'),
            bank: joi.string().required().label('Bank is required'),
            description: joi.string().label('Description is required'),
        });
        const { error } = schema.validate(payload);
        if (error)
            throw error.details[0].context.label;
        return true;
    }
};
exports.default = payment;
