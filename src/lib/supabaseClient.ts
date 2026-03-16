import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// No more eslint-disable needed. 
// We handle the check cleanly for local development.
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "[supabase] Missing env vars: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Add them to .env.local before running the app."
    );
  }
}

// Fallback to placeholder strings to prevent the build from crashing
// if environment variables aren't injected yet during the "Collecting page data" phase.