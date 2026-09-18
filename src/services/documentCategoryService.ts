import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "./authHelper";

export interface DocumentCategory {
  id: number;
  name: string;
  created_at: string;
}

export async function getDocumentCategories(): Promise<
  DocumentCategory[]
> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("document_categories")
    .select("id, name, created_at")
    .eq("user_id", userId)
    .order("name", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function addDocumentCategory(
  name: string
): Promise<DocumentCategory> {
  const userId = await getCurrentUserId();

  const categoryName = name.trim();

  if (!categoryName) {
    throw new Error(
      "Please enter a category name."
    );
  }

  const { data, error } = await supabase
    .from("document_categories")
    .insert({
      user_id: userId,
      name: categoryName,
    })
    .select("id, name, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "This category already exists."
      );
    }

    throw error;
  }

  if (!data) {
    throw new Error(
      "Category was not returned after saving."
    );
  }

  return data;
}

export async function updateDocumentCategory(
  id: number,
  name: string
): Promise<void> {
  const userId = await getCurrentUserId();

  const categoryName = name.trim();

  if (!categoryName) {
    throw new Error(
      "Please enter a category name."
    );
  }

  const { error } = await supabase
    .from("document_categories")
    .update({
      name: categoryName,
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "This category already exists."
      );
    }

    throw error;
  }
}

export async function deleteDocumentCategory(
  id: number
): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("document_categories")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}