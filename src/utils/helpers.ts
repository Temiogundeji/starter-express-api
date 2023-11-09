import bcrypt from "bcrypt";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const SALT_ROUNDS = 10;
import { logger, env, authConfig } from '../config';
const { APP_BASE_URL } = env;

export async function hashString(myString: string) {
  const hashedString = await bcrypt.hash(myString, SALT_ROUNDS);
  return hashedString;
}

export async function verifyString(myString: string, hashedString: string) {
  const match = await bcrypt.compare(myString, hashedString);
  return match;
}

/**
  * @Description - Encodes database credential parameter to base 64.
  * @param {string} - Database credential paramater e.g. database username, email, or cluster.
  * @returns {string} - base 64 equivalent of the string passed.
  */
export const base64Encode = (dbParameter: string) => {
  const base64EncodedString = Buffer.from(dbParameter).toString("base64");
  return base64EncodedString;
}

/**
  * @Description - Decodes database credential parameter from base 64.
  * @param {string} - Encoded string e.g. database username, email, or cluster.
  * @returns {string} - string equivalent of the encoded string passed.
  */
export const base64Decode = (base64EncodedString: string) => {
  const decodedString = Buffer.from(base64EncodedString, "base64").toString();
  return decodedString;
}

/**
 * @param length {number} -Specify the length of the token to be generated
 * @returns {string}
 */
export const generateAuthToken = (length: number): string => {
  const token = crypto.randomBytes(length).toString('hex');
  return token;
}

export const generateAccessToken = (email: string, isTemp: boolean): string => {
  return jwt.sign({ email }, process.env.JWT_SECRET as string as string, {
    expiresIn: !isTemp ? authConfig.jwtExpiration : authConfig.jwtTempExpiration,
  });
}