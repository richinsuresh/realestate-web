// src/app/api/contact/route.ts
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

type RequestBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function validate(body: RequestBody) {
  if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) return "Name is required";
  if (!body.email || typeof body.email !== "string" || !/^\S+@\S+\.\S+$/.test(body.email)) return "Valid email is required";
  if (!body.subject || typeof body.subject !== "string" || body.subject.trim().length === 0) return "Subject is required";
  if (!body.message || typeof body.message !== "string" || body.message.trim().length < 5) return "Message must be at least 5 characters";
  return null;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;

    const v = validate(body);
    if (v) {
      return NextResponse.json({ error: v }, { status: 400 });
    }

    // Read SMTP settings from env
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = Number(process.env.SMTP_PORT || "587");
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const TO_EMAIL = process.env.TO_EMAIL; // site owner address

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !TO_EMAIL) {
      // Missing configuration
      return NextResponse.json({ error: "Email server not configured" }, { status: 500 });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const fromAddress = `${body.name} <${body.email}>`;

    const html = `
      <p><strong>From:</strong> ${body.name} &lt;${body.email}&gt;</p>
      <p><strong>Subject:</strong> ${body.subject}</p>
      <hr />
      <div>${(body.message ?? "").replace(/\n/g, "<br/>")}</div>
    `;

    const mailOptions = {
      from: fromAddress,
      to: TO_EMAIL,
      subject: `[Website Contact] ${body.subject}`,
      text: `${body.message}\n\nFrom: ${body.name} <${body.email}>`,
      html,
    };

    // Send mail
    await transporter.sendMail(mailOptions);

    // Optional: store to Sanity or DB here (not implemented). You can add code to persist the message.

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
