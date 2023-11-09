const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema(
    {
        userId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true
        },
        balance: {
            type: Number,
            default: 0,
            required: [true, 'Please include amount'],
            min: [0, 'Must be a Real number'],
        }
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

export default mongoose.model("Wallet", WalletSchema);
