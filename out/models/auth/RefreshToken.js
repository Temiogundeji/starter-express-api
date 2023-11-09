"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const RefreshTokenSchema = new mongoose.Schema({
    token: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    expiryDate: Date,
});
RefreshTokenSchema.statics.createToken = async function (user) {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + config_1.authConfig.jwtRefreshExpiration);
    let _token = uuidv4();
    let _object = new this({
        token: _token,
        user: user._id,
        expiryDate: expiredAt.getTime(),
    });
    console.log(_object);
    let refreshToken = await _object.save();
    return refreshToken.token;
};
RefreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
};
const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
exports.default = RefreshToken;
