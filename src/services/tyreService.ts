import { getCurrentUserId } from "./authHelper";
import { supabase } from "../lib/supabase";
import type { TyreRecord } from "../types/tyre";


export type TyreInput = Omit<
  TyreRecord,
  "id" | "createdAt" | "updatedAt"
>;


/* =========================================================
   DATABASE → APPLICATION
   ========================================================= */

function mapDbToTyre(
  row: any
): TyreRecord {
  return {
    id: row.id,

    /*
     * Preserve the original owner.
     *
     * The UI will use this to determine
     * whether Edit/Delete should be shown.
     */
    user_id: row.user_id,

    brand:
      row.brand,

    model:
      row.model,

    size:
      row.size,

    purchaseDate:
      row.purchase_date,

    installDate:
      row.install_date,

    odometer:
      Number(
        row.odometer ?? 0
      ),

    cost:
      Number(
        row.cost ?? 0
      ),

    dealer:
      row.dealer,

    warrantyMonths:
      row.warranty_months,

    receipt:
      row.receipt ?? "",

    notes:
      row.notes ?? "",

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}


/* =========================================================
   APPLICATION → DATABASE
   ========================================================= */

function mapInputToDb(
  record: TyreInput
) {
  return {
    brand:
      record.brand,

    model:
      record.model,

    size:
      record.size,

    purchase_date:
      record.purchaseDate,

    install_date:
      record.installDate,

    odometer:
      record.odometer,

    cost:
      record.cost,

    dealer:
      record.dealer,

    warranty_months:
      record.warrantyMonths,

    receipt:
      record.receipt,

    notes:
      record.notes,
  };
}


/* =========================================================
   GET TYRES
   ========================================================= */

export async function getTyres(): Promise<
  TyreRecord[]
> {
  /*
   * IMPORTANT:
   *
   * Do NOT filter by the current user here.
   *
   * RLS now allows:
   *
   *   - own tyre records
   *   - family members' tyre records
   *
   * PostgreSQL determines which rows
   * are actually returned.
   */

  const {
    data,
    error,
  } = await supabase
    .from("tyres")
    .select("*")
    .order(
      "install_date",
      {
        ascending: false,
      }
    );


  if (error) {
    throw error;
  }


  return (
    data ?? []
  ).map(
    mapDbToTyre
  );
}


/* =========================================================
   ADD TYRE
   ========================================================= */

export async function addTyre(
  record: TyreInput
) {
  const userId =
    await getCurrentUserId();


  /*
   * New records always belong to
   * the currently authenticated user.
   */

  const {
    error,
  } = await supabase
    .from("tyres")
    .insert([
      {
        ...mapInputToDb(
          record
        ),

        user_id:
          userId,
      },
    ]);


  if (error) {
    throw error;
  }
}


/* =========================================================
   UPDATE TYRE
   ========================================================= */

export async function updateTyre(
  record: TyreRecord
) {
  const userId =
    await getCurrentUserId();


  /*
   * Owner-only update.
   *
   * This condition is also enforced
   * by the database RLS policy.
   */

  const {
    error,
  } = await supabase
    .from("tyres")
    .update({
      ...mapInputToDb(
        record
      ),

      updated_at:
        new Date().toISOString(),
    })
    .eq(
      "id",
      record.id
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
   DELETE TYRE
   ========================================================= */

export async function deleteTyre(
  id: number
) {
  const userId =
    await getCurrentUserId();


  /*
   * Owner-only delete.
   *
   * Family SELECT permission does NOT
   * grant DELETE permission.
   */

  const {
    error,
  } = await supabase
    .from("tyres")
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
   RESTORE TYRES
   ========================================================= */

export async function restoreTyres(
  records: TyreInput[]
) {
  if (
    records.length === 0
  ) {
    return;
  }


  const userId =
    await getCurrentUserId();


  /*
   * Restored records belong to
   * the currently authenticated user.
   *
   * We deliberately do not restore
   * another user's user_id.
   */

  const {
    error,
  } = await supabase
    .from("tyres")
    .insert(
      records.map(
        (record) => ({
          ...mapInputToDb(
            record
          ),

          user_id:
            userId,
        })
      )
    );


  if (error) {
    throw error;
  }
}