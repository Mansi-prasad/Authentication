import e from "express";
import { createTransport } from "nodemailer";

const sendMail = async ({ email, subject, html }) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 456,
    auth: {
      user: process.env.SMPT_USER,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  await transport.sendMail({
    from: process.env.SMPT_USER,
    to: email,
    subject,
    html,
  });
};

export default sendMail;
