import { getCurrentUserId } from "./authHelper";
import { supabase } from "../lib/supabase";
import type { DocumentRecord } from "../types/document";


/* =========================================================
   GET DOCUMENTS
   ========================================================= */

export async function getDocuments(): Promise<
  DocumentRecord[]
> {
  /*
   * Do NOT filter by the current user here.
   *
   * RLS allows the authenticated user to see:
   *   - their own documents
   *   - documents belonging to family members
   *
   * PostgreSQL/RLS determines which rows are returned.
   */

  const {
    data,
    error,
  } = await supabase
    .from("document_vault")
    .select("*")
    .order(
      "document_date",
      {
        ascending: false,
      }
    );


  if (error) {
    throw error;
  }


  return (data ?? []).map(
    (row) => ({
      id: row.id,

      /*
       * Preserve the original document owner.
       *
       * The UI needs this to determine whether
       * Edit/Delete should be displayed.
       */
      user_id: row.user_id,

      title:
        row.title,

      category:
        row.category,

      vehicle:
        row.vehicle ?? "",

      documentDate:
        row.document_date,

      file:
        row.file,

      notes:
        row.notes ?? "",

      createdAt:
        row.created_at,
    })
  );
}


/* =========================================================
   ADD DOCUMENT
   ========================================================= */

export async function addDocument(
  document: Omit<
    DocumentRecord,
    "id" | "user_id"
  >
) {
  const userId =
    await getCurrentUserId();


  /*
   * New documents always belong to
   * the currently authenticated user.
   */

  const {
    error,
  } = await supabase
    .from("document_vault")
    .insert({
      user_id:
        userId,

      title:
        document.title,

      category:
        document.category,

      vehicle:
        document.vehicle,

      document_date:
        document.documentDate,

      file:
        document.file,

      notes:
        document.notes,
    });


  if (error) {
    throw error;
  }
}


/* =========================================================
   UPDATE DOCUMENT
   ========================================================= */

export async function updateDocument(
  document: DocumentRecord
) {
  const userId =
    await getCurrentUserId();


  /*
   * Owner-only update.
   *
   * The user_id condition is retained here,
   * and PostgreSQL RLS independently enforces
   * the same ownership rule.
   */

  const {
    error,
  } = await supabase
    .from("document_vault")
    .update({
      title:
        document.title,

      category:
        document.category,

      vehicle:
        document.vehicle,

      document_date:
        document.documentDate,

      file:
        document.file,

      notes:
        document.notes,
    })
    .eq(
      "id",
      document.id
    )
    .eq(
      "user_id",
      userId
    );


  if (error) {
    throw error;
  }
}


/* =========================================================
   DELETE DOCUMENT
   ========================================================= */

export async function deleteDocument(
  id: number
) {
  const userId =
    await getCurrentUserId();


  /*
   * Only the document owner can delete.
   *
   * Family SELECT access does NOT grant DELETE access.
   */

  const {
    error,
  } = await supabase
    .from("document_vault")
    .delete()
    .eq(
      "id",
      id
    )
    .eq(
      "user_id",
      userId
    );


  if (error) {
    throw error;
  }
}


/* =========================================================
   RESTORE DOCUMENTS
   ========================================================= */

export async function restoreDocuments(
  documents: Omit<
    DocumentRecord,
    "id" | "user_id"
  >[]
) {
  if (
    documents.length === 0
  ) {
    return;
  }


  const userId =
    await getCurrentUserId();


  /*
   * Restored documents belong to the
   * currently authenticated user.
   *
   * We deliberately do not restore
   * another user's user_id.
   */

  const {
    error,
  } = await supabase
    .from("document_vault")
    .insert(
      documents.map(
        (document) => ({
          user_id:
            userId,

          title:
            document.title,

          category:
            document.category,

          vehicle:
            document.vehicle,

          document_date:
            document.documentDate,

          file:
            document.file,

          notes:
            document.notes,
        })
      )
    );


  if (error) {
    throw error;
  }
}