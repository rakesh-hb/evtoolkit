import { getCurrentUserId } from "./authHelper";
import { supabase } from "../lib/supabase";
import type { DocumentRecord } from "../types/document";

export async function getDocuments(): Promise<DocumentRecord[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("document_vault")
    .select("*")
    .eq("user_id", userId)
    .order("document_date", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    vehicle: row.vehicle ?? "",
    documentDate: row.document_date,
    file: row.file,
    notes: row.notes ?? "",
    createdAt: row.created_at,
  }));
}

export async function addDocument(
  document: Omit<DocumentRecord, "id">
) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("document_vault")
    .insert({
      user_id: userId,
      title: document.title,
      category: document.category,
      vehicle: document.vehicle,
      document_date: document.documentDate,
      file: document.file,
      notes: document.notes,
    });

  if (error) throw error;
}

export async function updateDocument(
  document: DocumentRecord
) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("document_vault")
    .update({
      title: document.title,
      category: document.category,
      vehicle: document.vehicle,
      document_date: document.documentDate,
      file: document.file,
      notes: document.notes,
    })
    .eq("id", document.id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function deleteDocument(id: number) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("document_vault")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function restoreDocuments(
  documents: Omit<DocumentRecord, "id">[]
) {
  if (documents.length === 0) return;

  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("document_vault")
    .insert(
      documents.map((document) => ({
        user_id: userId,
        title: document.title,
        category: document.category,
        vehicle: document.vehicle,
        document_date: document.documentDate,
        file: document.file,
        notes: document.notes,
      }))
    );

  if (error) throw error;
}