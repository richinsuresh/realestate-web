// src/app/api/contact/route.ts
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

/**
 * Temporary stub API for contact form.
 * - Validates the request
 * - Logs the request server-side for debugging
 * - Returns a success response but DOES NOT attempt to send email
 *
 * Replace the body of the `if (enableEmail)` branch with your nodemailer logic
 * once you have domain / SMTP credentials ready.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;

    const v = validate(body);
    if (v) {
      return NextResponse.json({ error: v }, { status: 400 });
    }

    // For now we do not send real emails. Toggle this to true to attempt sending.
    const enableEmail = false;

    if (!enableEmail) {
      // server-side debug log (visible in Vercel logs)
      // eslint-disable-next-line no-console
      console.log("Contact form (stub) received:", {
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message?.slice(0, 1000), // truncate for safety
      });

      return NextResponse.json({
        ok: true,
        stub: true,
        message: "Email sending is disabled on this build. The request was received and logged.",
      });
    }

    // ----- When you are ready to enable email (example outline) -----
    // NOTE: Keep this code commented out until you have SMTP / domain set up.
    //
    // import nodemailer from "nodemailer";
    // const SMTP_HOST = process.env.SMTP_HOST;
    // const SMTP_PORT = Number(process.env.SMTP_PORT || "587");
    // const SMTP_USER = process.env.SMTP_USER;
    // const SMTP_PASS = process.env.SMTP_PASS;
    // const TO_EMAIL = process.env.TO_EMAIL;
    //
    // if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !TO_EMAIL) {
    //   return NextResponse.json({ error: "Email server not configured" }, { status: 500 });
    // }
    //
    // const transporter = nodemailer.createTransport({
    //   host: SMTP_HOST,
    //   port: SMTP_PORT,
    //   secure: SMTP_PORT === 465,
    //   auth: { user: SMTP_USER, pass: SMTP_PASS },
    // });
    //
    // const fromAddress = `${body.name} <${body.email}>`;
    // const html = `<p><strong>From:</strong> ${body.name} &lt;${body.email}&gt;</p>
    //               <p><strong>Subject:</strong> ${body.subject}</p>
    //               <hr />
    //               <div>${(body.message ?? "").replace(/\n/g, "<br/>")}</div>`;
    //
    // await transporter.sendMail({
    //   from: fromAddress,
    //   to: TO_EMAIL,
    //   subject: `[Website Contact] ${body.subject}`,
    //   text: `${body.message}\n\nFrom: ${body.name} <${body.email}>`,
    //   html,
    // });
    //
    // return NextResponse.json({ ok: true });

  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("Contact API stub error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
