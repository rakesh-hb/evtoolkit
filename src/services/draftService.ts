import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "./authHelper";

export interface FormDraft<T = unknown> {
  id: string;
  user_id: string;
  form_key: string;
  draft_key: string;
  draft_data: T;
  created_at: string;
  updated_at: string;
}

export async function getFormDraft<T = unknown>(
  formKey: string,
  draftKey: string
): Promise<FormDraft<T> | null> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("form_drafts")
    .select(
      "id, user_id, form_key, draft_key, draft_data, created_at, updated_at"
    )
    .eq("user_id", userId)
    .eq("form_key", formKey)
    .eq("draft_key", draftKey)
    .maybeSingle();

  if (error) throw error;

  return data as FormDraft<T> | null;
}

export async function saveFormDraft<T = unknown>(
  formKey: string,
  draftKey: string,
  draftData: T
): Promise<FormDraft<T>> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("form_drafts")
    .upsert(
      {
        user_id: userId,
        form_key: formKey,
        draft_key: draftKey,
        draft_data: draftData,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,draft_key",
      }
    )
    .select(
      "id, user_id, form_key, draft_key, draft_data, created_at, updated_at"
    )
    .single();

  if (error) throw error;
  if (!data) throw new Error("Draft was not returned after saving.");

  return data as FormDraft<T>;
}

export async function deleteFormDraft(
  formKey: string,
  draftKey: string
): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("form_drafts")
    .delete()
    .eq("user_id", userId)
    .eq("form_key", formKey)
    .eq("draft_key", draftKey);

  if (error) throw error;
}
