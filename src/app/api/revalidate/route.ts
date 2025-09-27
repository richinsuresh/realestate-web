// src/app/api/revalidate/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    // check auth (requires supabase auth JWT in Authorization header)
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ ok: false, message: "No auth token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return NextResponse.json({ ok: false, message: "Invalid token" }, { status: 401 });
    }

    // ✅ Only allow authenticated users (optionally restrict by email)
    const email = data.user.email ?? "";
    const allowedAdmins = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim());
    if (allowedAdmins.length > 0 && !allowedAdmins.includes(email)) {
      return NextResponse.json({ ok: false, message: "Not authorized" }, { status: 403 });
    }

    // parse body
    const body = await req.json().catch(() => ({}));
    const paths: string[] = body.paths ?? [];

    if (!Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json({ ok: false, message: "No paths given" }, { status: 400 });
    }

    // revalidate each path
    paths.forEach((path) => {
      try {
        revalidatePath(path);
      } catch (err) {
        console.error("Revalidate failed for path:", path, err);
      }
    });

    return NextResponse.json({ revalidated: true, paths });
  } catch (err: any) {
    console.error("Revalidate API error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
