"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.generateAuthToken = exports.base64Decode = exports.base64Encode = exports.verifyString = exports.hashString = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const SALT_ROUNDS = 10;
const config_1 = require("../config");
const { APP_BASE_URL } = config_1.env;
async function hashString(myString) {
    const hashedString = await bcrypt_1.default.hash(myString, SALT_ROUNDS);
    return hashedString;
}
exports.hashString = hashString;
async function verifyString(myString, hashedString) {
    const match = await bcrypt_1.default.compare(myString, hashedString);
    return match;
}
exports.verifyString = verifyString;
/**
  * @Description - Encodes database credential parameter to base 64.
  * @param {string} - Database credential paramater e.g. database username, email, or cluster.
  * @returns {string} - base 64 equivalent of the string passed.
  */
const base64Encode = (dbParameter) => {
    const base64EncodedString = Buffer.from(dbParameter).toString("base64");
    return base64EncodedString;
};
exports.base64Encode = base64Encode;
/**
  * @Description - Decodes database credential parameter from base 64.
  * @param {string} - Encoded string e.g. database username, email, or cluster.
  * @returns {string} - string equivalent of the encoded string passed.
  */
const base64Decode = (base64EncodedString) => {
    const decodedString = Buffer.from(base64EncodedString, "base64").toString();
    return decodedString;
};
exports.base64Decode = base64Decode;
/**
 * @param length {number} -Specify the length of the token to be generated
 * @returns {string}
 */
const generateAuthToken = (length) => {
    const token = crypto_1.default.randomBytes(length).toString('hex');
    return token;
};
exports.generateAuthToken = generateAuthToken;
const generateAccessToken = (email, isTemp) => {
    return jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: !isTemp ? config_1.authConfig.jwtExpiration : config_1.authConfig.jwtTempExpiration,
    });
};
exports.generateAccessToken = generateAccessToken;
