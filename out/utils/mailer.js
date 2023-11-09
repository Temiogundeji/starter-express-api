"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS
    },
});
async function sendEmail(emails, subject = '', body = ``) {
    emails = Array.isArray(emails) ? emails : emails.split(',');
    const msg = body.includes('<title>') ? await transporter.sendMail({
        from: '"FPI Muslim Community Cooperative" <temyuph@gmail.com>',
        to: [...emails],
        subject,
        html: body,
    }) : await transporter.sendMail({
        from: '"FPI Muslim Community Cooperative" <temyuph@gmail.com>',
        to: [...emails],
        subject,
        text: body,
    });
    console.log("Message sent: %s", msg.messageId);
    return msg;
}
exports.default = sendEmail;
