"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const TransactionSchema = new mongoose.Schema({
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true
    },
    payment_ref: {
        type: String,
        required: [true, "Payment reference is required"]
    },
    amount: {
        type: Number,
        required: [true, 'Please include amount'],
        min: [0, 'Must be a Real number'],
    },
    description: {
        type: String,
        required: [true, "Please include transaction description"]
    },
    type: {
        type: String,
        enum: ['savings', 'withdrawal'],
        required: [true, 'All transactions must have a type'],
    },
    status: {
        type: String,
        enum: ['success', 'failure', 'pending'],
        default: 'pending',
        required: [true, 'All transactions must have status'],
    }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true });
exports.default = mongoose.model("Transaction", TransactionSchema);
