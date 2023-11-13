"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const AppError_1 = require("../exceptions/AppError");
const superagent_1 = __importDefault(require("superagent"));
const crypto_1 = require("crypto");
const logger_1 = __importDefault(require("../config/logger"));
// import { ObjectId } from "mongodb";
class Payment {
    async initialize(user, paymentBody, metaObj) {
        try {
            let appUser = user;
            const { amount } = paymentBody;
            let meta = { ...metaObj, userId: user?._id.toString() };
            const { body: { data, status }, } = await superagent_1.default
                .post(`https://api.paystack.co/transaction/initialize`)
                .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
                .set('Content-Type', 'application/json')
                .send({
                email: appUser.email,
                amount: String(Number(amount) * 100),
                callback_url: 'https://standard.paystack.co/close',
                reference: (0, crypto_1.randomUUID)(),
                metadata: meta,
            });
            (0, logger_1.default)("PAYSTACK RESPONSE DATA", data);
            return { data, status };
        }
        catch (e) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: e.message
            });
        }
    }
    async verifyTransaction(paymentRef) {
        try {
            const { body: { data }, } = await superagent_1.default
                .post(`htps://api.paystack.co/transaction/verify/${paymentRef}t`)
                .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
                .set('Content-Type', 'application/json')
                .send({
                callback_url: 'https://standard.paystack.co/close',
                reference: (0, crypto_1.randomUUID)(),
            });
            (0, logger_1.default)("PAYSTACK RESPONSE DATA", data);
            //Data can be saved to charged user recurrently through their authorization code
            return data;
        }
        catch (e) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: e.message
            });
        }
    }
    async createRecipient(user, accNumber, bank) {
        const reqBody = {
            type: "nuban",
            name: user.firstName + " " + user.lastName,
            account_number: Number(accNumber),
            bank_code: "999992",
            currency: "NGN"
        };
        try {
            const { body: { status, data }, } = await superagent_1.default
                .post(`https://api.paystack.co/transferrecipient`)
                .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
                .set('Content-Type', 'application/json')
                .send(reqBody);
            return { data, status };
        }
        catch (e) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: e.message
            });
        }
    }
    async chargeRecurrently(authCode, amount, user) {
        const { body: { status, data }, } = await superagent_1.default
            .post(`https://api.paystack.co/transaction/charge_authorization`)
            .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
            .set('Content-Type', 'application/json')
            .send({
            amount: String(Number(amount) * 100), email: user.email,
            "authorization_code": authCode
        });
        (0, logger_1.default)("PAYSTACK RESPONSE DATA", data);
        //Data can be saved to charged user recurrently through their authorization code
        return { data, status };
    }
    async makeTransfer(user, metaObj, paymentObj, recipient) {
        let appUser = user;
        let meta = { ...metaObj, userId: appUser?._id.toString() };
        const reqBody = {
            source: paymentObj.source,
            reason: paymentObj.reason,
            amount: Number(paymentObj.amount) * 100,
            reference: (0, crypto_1.randomUUID)(),
            recipient: recipient,
            metadata: meta
        };
        console.log(reqBody, "BODY OF THE REQUEST");
        try {
            const { body: { data, status }, } = await superagent_1.default
                .post(`https://api.paystack.co/transfer`)
                .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
                .set('Content-Type', 'application/json')
                .send(reqBody);
            (0, logger_1.default)("PAYSTACK RESPONSE DATA", data);
            //Data can be saved to charged user recurrently through their authorization code
            return data;
        }
        catch (e) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: e.message
            });
        }
    }
    async resolveAccountNumber(accNumber, bank) {
        try {
            const { body: { status, data }, } = await superagent_1.default
                .get(`https://api.paystack.co/bank/resolve?account_number=${accNumber}&bank_code=${bank}`)
                .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
                .set('Content-Type', 'application/json');
            return { data, status };
        }
        catch (e) {
            throw new utils_1.AppError({
                httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
                description: e.message
            });
        }
    }
    async getAllBanks() {
        const { body: { status, data }, } = await superagent_1.default
            .post(`https://api.paystack.co/bank`)
            .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
            .set('Content-Type', 'application/json');
        return { data, status };
    }
    async getCountries() {
        const { body: { status, data }, } = await superagent_1.default
            .post(`https://api.paystack.co/country`)
            .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
            .set('Content-Type', 'application/json');
        return { data, status };
    }
}
exports.default = new Payment;
