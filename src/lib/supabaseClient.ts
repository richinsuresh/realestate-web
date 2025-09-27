// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Helpful early failure during local development
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.warn(
      `[supabase] Missing env vars: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.
      Add them to .env.local before running the app.`
    );
  }
  // still create a client — createClient will throw if values are invalid at runtime
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
