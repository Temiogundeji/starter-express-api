"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const mongodb_1 = require("mongodb");
const _types_1 = require("../../@types");
const utils_1 = require("../../utils");
const Wallet_1 = __importDefault(require("../../models/Wallet"));
const Transactions_1 = __importDefault(require("../../services/Transactions"));
const mailer_1 = __importDefault(require("../../utils/mailer"));
const models_1 = require("../../models");
const { apiResponse } = utils_1.Toolbox;
const savingsHTML = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../templates/savings.html'), {
    encoding: 'utf-8',
});
const payStackWebHook = async (req, res) => {
    try {
        const hash = crypto_1.default.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY_TEST).update(JSON.stringify(req.body)).digest('hex');
        if (hash === req.headers['x-paystack-signature']) {
            const { event, data } = req.body;
            switch (event) {
                case "charge.success":
                    console.log(data, "Payment Response Data Here");
                    //Update wallet to reflect new user savings
                    const updatedWallet = await Wallet_1.default.findOneAndUpdate({ userId: new mongodb_1.ObjectId(data.metadata?.userId) }, { $inc: { balance: Number(data.metadata?.amount) } }, { new: true });
                    console.log(updatedWallet, "UPDATED WALLET HERE");
                    // Create new transaction
                    const newTransaction = await Transactions_1.default.createTransaction({
                        walletId: updatedWallet._id,
                        payment_ref: data?.reference,
                        amount: data.metadata?.amount,
                        description: data.metadata?.description,
                        type: data.metadata?.type,
                        status: data.status
                    });
                    console.log("NEW TRANSACTION", newTransaction);
                    const user = await models_1.User.findOne({ email: data.customer?.email });
                    if (data.metadata?.type === "savings") {
                        await (0, mailer_1.default)(data.customer?.email, 'Congratulations!!! Your payment has been successful 🎉', savingsHTML.replace(`{{NAME}}`, `${user?.firstName}`)
                            .replace(`{{AMOUNT}}`, data.metadata?.amount));
                    }
                    break;
                case "charge.failed":
                    console.log("Something is wrong");
                    break;
                case "transfer.success":
                    console.log(data, "TRANSFER SUCCESSFUL");
                    await models_1.Transaction.findOneAndUpdate({
                    //Update transaction here
                    });
                    await (0, mailer_1.default)(data.customer?.email, 'Congratulations!!! Your withdrawal has been successful 🎉', savingsHTML.replace(`{{NAME}}`, `${data.recipient?.name.split(" ")[0]}`)
                        .replace(`{{AMOUNT}}`, data?.amount));
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
        return apiResponse(res, _types_1.ResponseType.FAILURE, _types_1.StatusCode.INTERNAL_SERVER_ERROR, _types_1.ResponseCode.FAILURE, {}, `looks like something went wrong: ${JSON.stringify(error)} `);
    }
};
exports.default = payStackWebHook;
