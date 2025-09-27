import { createClient } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;
if (!BUCKET) throw new Error("[config] Missing NEXT_PUBLIC_SUPABASE_BUCKET env.");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const serverSupabase =
  SERVICE_ROLE && SUPABASE_URL
    ? createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } })
    : null;

export async function resolveImageUrl(keyOrUrl?: string | null, expiresSec = 60) {
  if (!keyOrUrl) return null;
  const t = keyOrUrl.trim();
  if (!t) return null;
  try {
    const u = new URL(t);
    if (u.protocol === "http:" || u.protocol === "https:") return t;
  } catch {}
  if (t.startsWith("/")) return t;

  // storage key
  if (serverSupabase) {
    const { data, error } = await serverSupabase.storage.from(BUCKET).createSignedUrl(t, expiresSec);
    if (!error && data?.signedUrl) return data.signedUrl;
  }
  const publicRes = supabase.storage.from(BUCKET).getPublicUrl(t);
  return (publicRes?.data as any)?.publicUrl ?? (publicRes?.data as any)?.publicURL ?? null;
}
