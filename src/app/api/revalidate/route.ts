// src/app/api/revalidate/route.ts
import { NextResponse } from "next/server";

const SECRET = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const received = req.headers.get("x-sanity-webhook-secret");

  if (!SECRET || received !== SECRET) {
    return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }

  try {
    // Revalidate the listings page
    // Using Next's revalidatePath (App Router helpers) if available:
    // @ts-ignore - next/headers or app-directory helper may vary by Next version
    // If using Node server adapter (Vercel), use res.revalidate in Route Handlers
    const urlToRevalidate = "/listings";
    // If running on Vercel / Node, you can call revalidate:
    // import { revalidatePath } from 'next/cache'; revalidatePath(urlToRevalidate);
    // For portability, hit your site revalidation endpoint (if you have one)
    // Here we attempt to call the internal revalidate endpoint if present:
    try {
      // Revalidate via Next's built-in API (Vercel): trigger a GET to your runtime revalidation route if needed.
      // Fallback: use fetch to hit the page to warm cache (not true revalidate).
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}${urlToRevalidate}`, { method: "GET" });
    } catch (e) {
      // ignore
    }
    return NextResponse.json({ revalidated: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
