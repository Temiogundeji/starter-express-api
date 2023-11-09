const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema(
    {
        walletId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wallet",
            require: true
        },
        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
            require: true
        },
        amount: {
            type: mongoose.Schema.Types.Number,
            require: true
        }
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

export default mongoose.model("Wallet", WalletSchema);
