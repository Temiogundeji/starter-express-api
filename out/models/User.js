"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { isEmail } = require("validator");
const UserSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: [true, "Please provide firstName"],
    },
    lastName: {
        type: String,
        required: [true, "Please provide lastName"],
    },
    email: {
        type: String,
        unique: true,
        validate: [isEmail, "Please add a valid email address"],
        sparse: true,
        lowercase: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        unique: true,
    },
    accountNumber: {
        type: String,
        unique: true,
        default: "000000000000"
    },
    staffId: {
        type: String,
        unique: true,
        require: true
    },
    roles: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Role",
        },
    ],
    password: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    staffType: {
        type: String,
        enum: ["teaching", "non-teaching"]
    },
    refreshToken: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "RefreshToken",
    },
    accessToken: { type: String },
    // walletId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Wallet"
    // },
    hasLoggedIn: {
        type: Boolean,
        default: false,
        required: true,
    },
    expiresIn: Date,
    isActive: {
        type: Boolean,
        default: false,
    },
    profileImage: {
        type: String,
    }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true });
exports.default = mongoose_1.default.model("User", UserSchema);
