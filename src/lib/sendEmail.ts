// lib/sendEmail.ts

import nodemailer from "nodemailer";

export interface SendEmailParams {
  from: string;
  to: string | string[];
  bcc?: string | string[];
  subject: string;
  html: string;

  attachments?: {
    content: Buffer | any;
    filename?: string;
  }[];
}

export async function sendEmail({
  from,
  to,
  bcc,
  subject,
  html,
  attachments,
}: SendEmailParams): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  await transporter.verify();

  await transporter.sendMail({
    from,
    to,
    bcc,
    subject,
    html,
    attachments,
  });
}
