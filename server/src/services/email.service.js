// server/src/services/email.service.js
import nodemailer from "nodemailer";

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  CONTACT_RECEIVER,
} = process.env;

if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !CONTACT_RECEIVER) {
  console.warn("⚠️ Email environment variables are not fully configured.");
}

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT) || 587,
  secure: false, // 587 -> false, 465 -> true
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export async function sendContactEmail({ name, email, message }) {
  const mailOptions = {
    from: `"Collab Verse Contact" <${EMAIL_USER}>`,
    to: CONTACT_RECEIVER,
    subject: `New contact form message from ${name}`,
    text: `
Name: ${name}
Email: ${email}

Message:
${message}
    `,
    html: `
      <h2>New Contact Form Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${String(message || "").replace(/\n/g, "<br />")}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
