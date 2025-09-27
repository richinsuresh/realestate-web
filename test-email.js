// test-email.js
const nodemailer = require("nodemailer");

async function run() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465, // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"ARK Infra" <${process.env.SMTP_USER}>`,
    to: "your-personal-email@example.com",
    subject: "Titan SMTP test",
    text: "This is a test from nodemailer via Titan SMTP",
  });

  console.log("Message sent:", info.messageId);
  transporter.close();
}

run().catch(err => {
  console.error("Send failed:", err);
});
