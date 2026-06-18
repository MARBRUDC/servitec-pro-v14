import { createClient } from "@supabase/supabase-js";

function getEnvValue(value: string | undefined) {
  return value?.trim() || undefined;
}

const supabaseUrl = getEnvValue(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = getEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      "Supabase no esta configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.",
    );
  }

  return supabase;
}
