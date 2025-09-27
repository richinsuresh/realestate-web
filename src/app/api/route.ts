// src/app/api/route.ts  (adjust path if route is /api/contact/route.ts)
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { checkRate } from '@/lib/rateLimit';

const ENABLE_EMAIL = process.env.ENABLE_EMAIL === 'true';

const transporter = ENABLE_EMAIL ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}) : null;

export async function POST(req: Request) {
  try {
    const ip = (req as any).headers?.get?.('x-forwarded-for') ?? 'unknown';
    const rate = checkRate(ip);
    if (!rate.ok) {
      return NextResponse.json({ error: 'Rate limit exceeded', retryAfter: rate.retryAfter }, { status: 429 });
    }

    const body = await req.json();
    const { name, email, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (ENABLE_EMAIL && transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
        to: process.env.CONTACT_RECEIVER_EMAIL,
        subject: `Contact form: ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`
      });
    } else {
      // persist to DB or queue in production; for now log minimal info
      console.info('Contact submit (email disabled):', { name, email });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', (err as Error).message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
