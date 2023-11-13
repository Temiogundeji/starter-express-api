import { AppError } from "../utils";
import { HttpCode } from "../exceptions/AppError";
import superagent from "superagent";
import { randomUUID as v4 } from "crypto";
import { IUser } from "../@types";
import log from "../config/logger";
import payment from "../validations/payments";
import { IWithdraw } from "../@types/withdraw";
// import { ObjectId } from "mongodb";

class Payment {
    async initialize(user: IUser, paymentBody: any, metaObj: Object) {
        try {
            let appUser = user;
            const { amount } = paymentBody;
            let meta = { ...metaObj, userId: user?._id.toString() }
            const {
                body: { data, status },
            } = await superagent
                .post(`https://api.paystack.co/transaction/initialize`)
                .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
                .set('Content-Type', 'application/json')
                .send({
                    email: appUser.email,
                    amount: String(Number(amount) * 100),
                    callback_url: 'https://standard.paystack.co/close',
                    reference: v4(),
                    metadata: meta,
                });

            log("PAYSTACK RESPONSE DATA", data);

            return { data, status };

        } catch (e: any) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: e.message
            }
            );
        }

    }

    async verifyTransaction(paymentRef: string) {
        try {
            const {
                body: { data },
            } = await superagent
                .post(`htps://api.paystack.co/transaction/verify/${paymentRef}t`)
                .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
                .set('Content-Type', 'application/json')
                .send({
                    callback_url: 'https://standard.paystack.co/close',
                    reference: v4(),
                });

            log("PAYSTACK RESPONSE DATA", data);
            //Data can be saved to charged user recurrently through their authorization code
            return data;

        } catch (e: any) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: e.message
            }
            );
        }
    }

    async createRecipient(user: IUser, accNumber: string, bank: string) {
        const reqBody = {
            type: "nuban",
            name: user.firstName + " " + user.lastName,
            account_number: Number(accNumber),
            bank_code: "999992",
            currency: "NGN"
        }
        try {
            const {
                body: { status, data },
            } = await superagent
                .post(`https://api.paystack.co/transferrecipient`)
                .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
                .set('Content-Type', 'application/json')
                .send(reqBody);
            return { data, status }
        }
        catch (e: any) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: e.message
            }
            );
        }
    }

    async chargeRecurrently(authCode: string, amount: number, user: IUser) {
        const {
            body: { status, data },
        } = await superagent
            .post(`https://api.paystack.co/transaction/charge_authorization`)
            .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
            .set('Content-Type', 'application/json')
            .send({
                amount: String(Number(amount) * 100), email: user.email,
                "authorization_code": authCode
            });

        log("PAYSTACK RESPONSE DATA", data);
        //Data can be saved to charged user recurrently through their authorization code
        return { data, status };
    }
    async makeTransfer(user: IUser, metaObj: Object, paymentObj: { source: string, reason: string, amount: number }, recipient: string) {

        let appUser = user;
        let meta = { ...metaObj, userId: appUser?._id.toString() }
        const reqBody = {
            source: paymentObj.source,
            reason: paymentObj.reason,
            amount: Number(paymentObj.amount) * 100,
            reference: v4(),
            recipient: recipient,
            metadata: meta
        }

        console.log(reqBody, "BODY OF THE REQUEST");
        try {
            const {
                body: { data, status },
            } = await superagent
                .post(`https://api.paystack.co/transfer`)
                .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
                .set('Content-Type', 'application/json')
                .send(reqBody);

            log("PAYSTACK RESPONSE DATA", data);
            //Data can be saved to charged user recurrently through their authorization code
            return data;
        }
        catch (e: any) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: e.message
            }
            );
        }
    }

    async resolveAccountNumber(accNumber: number, bank: number) {
        try {
            const {
                body: { status, data },
            } = await superagent
                .get(`https://api.paystack.co/bank/resolve?account_number=${accNumber}&bank_code=${bank}`)
                .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
                .set('Content-Type', 'application/json')
            return { data, status }
        }
        catch (e: any) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: e.message
            }
            );
        }
    }

    async getAllBanks() {
        const {
            body: { status, data },
        } = await superagent
            .post(`https://api.paystack.co/bank`)
            .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
            .set('Content-Type', 'application/json')
        return { data, status }
    }

    async getCountries() {
        const {
            body: { status, data },
        } = await superagent
            .post(`https://api.paystack.co/country`)
            .set('Authorization', `Bearer ${process.env.PAYSTACK_SECRET_KEY_TEST}`)
            .set('Content-Type', 'application/json')
        return { data, status }
    }

}

export default new Payment;