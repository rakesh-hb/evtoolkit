import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "./authHelper";

export interface FormDraft<T = unknown> {
  id: number;
  draft_key: string;
  draft_data: T;
  created_at: string;
  updated_at: string;
}

/**
 * Get a saved draft for the current authenticated user.
 */
export async function getFormDraft<T = unknown>(
  draftKey: string
): Promise<FormDraft<T> | null> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("form_drafts")
    .select("id, draft_key, draft_data, created_at, updated_at")
    .eq("user_id", userId)
    .eq("draft_key", draftKey)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return data as FormDraft<T>;
}

/**
 * Save or update a draft for the current authenticated user.
 */
export async function saveFormDraft<T = unknown>(
  draftKey: string,
  draftData: T
): Promise<FormDraft<T>> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("form_drafts")
    .upsert(
      {
        user_id: userId,
        draft_key: draftKey,
        draft_data: draftData,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,draft_key",
      }
    )
    .select("id, draft_key, draft_data, created_at, updated_at")
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Draft was not returned after saving.");
  }

  return data as FormDraft<T>;
}

/**
 * Delete a specific draft belonging to the current authenticated user.
 */
export async function deleteFormDraft(
  draftKey: string
): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("form_drafts")
    .delete()
    .eq("user_id", userId)
    .eq("draft_key", draftKey);

  if (error) {
    throw error;
  }
}

/**
 * Delete all drafts belonging to the current authenticated user.
 */
export async function deleteAllFormDrafts(): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("form_drafts")
    .delete()
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}