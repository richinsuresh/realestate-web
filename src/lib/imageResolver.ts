// src/lib/imageResolver.ts
import { createClient } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

/**
 * Resolve an image stored in Supabase Storage.
 * - Accepts either a full URL, a local path ("/...") or a storage key.
 * - If storage key is provided and a service role key exists, tries createSignedUrl().
 * - Falls back to getPublicUrl() for public buckets.
 *
 * Returns a string (URL) or null if resolution failed / input was empty.
 */

// Ensure BUCKET is a definite string so TS knows it (empty string == missing)
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const serverSupabase =
  SERVICE_ROLE && SUPABASE_URL
    ? createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } })
    : null;

function isEmptyVal(s?: string | null): s is undefined | null | "" {
  return !s || s.trim() === "" || s.trim() === "null" || s.trim() === "undefined";
}

function looksLikeAbsoluteUrl(s?: string | null) {
  if (isEmptyVal(s)) return false;
  try {
    const u = new URL(s!.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function looksLikeLocalPath(s?: string | null) {
  return !!(s && typeof s === "string" && s.startsWith("/"));
}

export default async function resolveImageUrl(keyOrUrl?: string | null, expiresSec = 60): Promise<string | null> {
  if (isEmptyVal(keyOrUrl)) return null;
  const trimmed = (keyOrUrl ?? "").trim();
  if (!trimmed) return null;

  // If already an absolute URL or local path, return as-is
  if (looksLikeAbsoluteUrl(trimmed) || looksLikeLocalPath(trimmed)) return trimmed;

  // if BUCKET missing, bail early (caller should set NEXT_PUBLIC_SUPABASE_BUCKET)
  if (!BUCKET) {
    console.error("[imageResolver] NEXT_PUBLIC_SUPABASE_BUCKET is not set.");
    return null;
  }

  // treat trimmed as a storage key
  const storageKey: string = trimmed;

  // Try signed URL (server supabase with service role) — only if serverSupabase exists
  if (serverSupabase) {
    try {
      // createSignedUrl requires a string key — storageKey is definitely a string
      const { data, error } = await serverSupabase.storage.from(BUCKET).createSignedUrl(storageKey, expiresSec);
      if (!error && data?.signedUrl) return data.signedUrl;
      if (error) console.debug("[imageResolver] createSignedUrl returned error:", error.message ?? error);
    } catch (err) {
      console.error("[imageResolver] createSignedUrl unexpected error:", err);
    }
  }

  // Fallback: getPublicUrl using anon client (works for public bucket)
  try {
    const publicRes = supabase.storage.from(BUCKET).getPublicUrl(storageKey);
    const publicUrl = (publicRes?.data as any)?.publicUrl ?? (publicRes?.data as any)?.publicURL ?? null;
    if (publicUrl) return publicUrl;
    // If getPublicUrl didn't return a URL, log details for debugging
    console.debug("[imageResolver] getPublicUrl returned no url", publicRes);
  } catch (err) {
    console.error("[imageResolver] getPublicUrl error:", err);
  }

  return null;
}
