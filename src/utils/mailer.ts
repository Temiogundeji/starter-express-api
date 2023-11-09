import nodemailer from 'nodemailer';
import Mailgun from 'mailgun-js';
import { env } from '../config';

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS
    },
});


export default async function sendEmail(emails: any, subject = '', body = ``) {
    emails = Array.isArray(emails) ? emails : emails.split(',')
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