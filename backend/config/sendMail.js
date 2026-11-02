import { createTransport } from "nodemailer";
import { forgotPasswordHtml } from "./html.js";

export const sendMail = async ({ email, subject, html }) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return await transport.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject,
    html,
  });
};

export default sendMail;

// Send password reset email
export const sendResetPasswordMail = async ({ email, token }) => {
  const subject = "Reset Your Password";
  const html = forgotPasswordHtml({ email, token });

  return await sendMail({ email, subject, html });
};
