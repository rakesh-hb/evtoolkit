import { supabase } from "../lib/supabase";
import type { DocumentRecord } from "../types/document";

export async function getDocuments(): Promise<DocumentRecord[]> {
  const { data, error } = await supabase
    .from("document_vault")
    .select("*")
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
  const { error } = await supabase
    .from("document_vault")
    .insert({
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
    .eq("id", document.id);

  if (error) throw error;
}

export async function deleteDocument(id: number) {
  const { error } = await supabase
    .from("document_vault")
    .delete()
    .eq("id", id);

  if (error) throw error;
}