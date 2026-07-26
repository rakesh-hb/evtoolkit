import { supabase } from "../lib/supabase";

export async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  if (!user) {
    throw new Error("User not authenticated");
  }

  return user.id;
}