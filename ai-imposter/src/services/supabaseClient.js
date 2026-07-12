import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env file.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Every player is an anonymous Supabase Auth user under the hood (see
 * docs/04_DATABASE_AND_SUPABASE.md). This makes sure a session exists before
 * any room/player row is written, since RLS checks auth.uid() against
 * players.auth_user_id.
 *
 * @returns {Promise<string>} the current auth user's id
 */
export async function ensureAnonymousSession() {
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
