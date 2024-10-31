// src/helpers/email.helper.ts
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { config } from '../config';

dotenv.config();

export async function sendAlertEmail(
  recipient: string,
  chain: string,
  price: number,
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  });

  const mailOptions = {
    from: config.emailUser,
    to: recipient,
    subject: `Alert: ${chain} Price Notification`,
    text: `The price of ${chain} has reached ${price}.`,
  };

  await transporter.sendMail(mailOptions);
}
