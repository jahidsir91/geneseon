import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

function getClient(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }
  client = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return client;
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    const activeClient = getClient();
    const value: unknown = Reflect.get(activeClient, property, activeClient);
    return typeof value === "function" ? value.bind(activeClient) : value;
  },
});

export const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";
export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "academy-files";