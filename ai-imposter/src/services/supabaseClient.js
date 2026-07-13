import { createClient } from "@supabase/supabase-js";

export let supabase = null;

/** Initialize the shared browser client only from the Supabase provider. */
export function initializeSupabase(environment = import.meta.env) {
  const supabaseUrl = environment?.VITE_SUPABASE_URL;
  const supabaseAnonKey = environment?.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase provider requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabase;
}

/**
 * Every player is an anonymous Supabase Auth user under the hood (see
 * docs/04_DATABASE_AND_SUPABASE.md). This makes sure a session exists before
 * any room/player row is written, since RLS checks auth.uid() against
 * players.auth_user_id.
 *
 * @returns {Promise<string>} the current auth user's id
 */
export async function ensureAnonymousSession() {
  if (!supabase) {
    throw new Error(
      "Supabase has not been initialized. Use createSupabaseServices() first.",
    );
  }

  const { data: sessionData } = await supabase.auth.getSession();

  if (sessionData.session) {
    return sessionData.session.user.id;
  }

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    throw error;
  }

  return data.user.id;
}
