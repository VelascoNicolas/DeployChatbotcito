import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.DB_URL ||
    "https://trdnrlxhjyifsuwaqiey.supabase.co",
  process.env.SUPABASE_DB_KEY || ""
);

export const supabaseAdmin = createClient(
  process.env.DB_URL ||
    "https://trdnrlxhjyifsuwaqiey.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);
