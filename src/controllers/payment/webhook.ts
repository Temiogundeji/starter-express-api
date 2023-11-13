import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import { ResponseCode, ResponseType, StatusCode } from '../../@types';
import { Toolbox } from '../../utils';
import Wallet from '../../models/Wallet';
import Transactions from "../../services/Transactions";
import mailer from '../../utils/mailer';
import { Transaction, User } from "../../models";



const { apiResponse } = Toolbox;


const savingsHTML = fs.readFileSync(path.join(__dirname, '../../templates/savings.html'), {
    encoding: 'utf-8',
});

const payStackWebHook = async (req: Request, res: Response) => {
    try {
        const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY_TEST as string).update(JSON.stringify(req.body)).digest('hex');
        if (hash === req.headers['x-paystack-signature']) {
            const { event, data } = req.body;
            switch (event) {
                case "charge.success":
                    console.log(data, "Payment Response Data Here");
                    //Update wallet to reflect new user savings
                    const updatedWallet = await Wallet.findOneAndUpdate(
                        { userId: new ObjectId(data.metadata?.userId) },
                        { $inc: { balance: Number(data.metadata?.amount) } },
                        { new: true }
                    );

                    console.log(updatedWallet, "UPDATED WALLET HERE")
                    // Create new transaction
                    const newTransaction = await Transactions.createTransaction({
                        walletId: updatedWallet._id,
                        payment_ref: data?.reference,
                        amount: data.metadata?.amount,
                        description: data.metadata?.description,
                        type: data.metadata?.type,
                        status: data.status
                    });

                    console.log("NEW TRANSACTION", newTransaction)

                    const user = await User.findOne({ email: data.customer?.email });

                    if (data.metadata?.type === "savings") {
                        await mailer(
                            data.customer?.email,
                            'Congratulations!!! Your payment has been successful 🎉',
                            savingsHTML.replace(`{{NAME}}`, `${user?.firstName}`)
                                .replace(`{{AMOUNT}}`, data.metadata?.amount),
                        );
                    }

                    break;
                case "charge.failed":
                    console.log("Something is wrong");
                    break;
                case "transfer.success":
                    console.log(data, "TRANSFER SUCCESSFUL");
                    await Transaction.findOneAndUpdate({
                        //Update transaction here
                    });
                    await mailer(
                        data.customer?.email,
                        'Congratulations!!! Your withdrawal has been successful 🎉',
                        savingsHTML.replace(`{{NAME}}`, `${data.recipient?.name.split(" ")[0]}`)
                            .replace(`{{AMOUNT}}`, data?.amount),
                    );
                    break;
                case "transfer.failed":
                    break;
                default:
                    break;
            }
        }
        res.sendStatus(200);
    }
    catch (error) {
        return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.INTERNAL_SERVER_ERROR,
            ResponseCode.FAILURE,
            {},
            `looks like something went wrong: ${JSON.stringify(error)} `
        );
    }
}


export default payStackWebHook