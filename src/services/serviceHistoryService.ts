import { supabase } from "../lib/supabase";
import type { ServiceRecord } from "../types/service";
import { getCurrentUserId } from "./authHelper";


/* =========================================================
   SERVICE HISTORY
   ========================================================= */


export async function getServiceRecords(): Promise<
  ServiceRecord[]
> {
  /*
   * Do NOT filter by the current user here.
   *
   * RLS now allows the authenticated user to see:
   *   - their own service records
   *   - service records belonging to family members
   *
   * PostgreSQL/RLS decides which rows are actually
   * returned.
   */

  const {
    data,
    error,
  } = await supabase
    .from("service_history")
    .select("*")
    .order(
      "service_date",
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
       * Keep the original creator/owner.
       *
       * This is required so the UI can distinguish
       * the current user's records from another
       * family member's records.
       */
      user_id: row.user_id,

      vehicle:
        row.vehicle,

      date:
        row.service_date,

      odometer:
        Number(
          row.odometer ?? 0
        ),

      serviceType:
        row.service_type,

      serviceCenter:
        row.workshop,

      amount:
        Number(
          row.cost ?? 0
        ),

      notes:
        row.notes ?? "",

      attachment:
        row.attachment ?? "",
    })
  );
}


/* =========================================================
   ADD SERVICE RECORD
   ========================================================= */


export async function addServiceRecord(
  record: Omit<
    ServiceRecord,
    "id" | "user_id"
  >
) {
  const userId =
    await getCurrentUserId();


  /*
   * The record is always created under the
   * currently authenticated user's ID.
   *
   * RLS also requires auth.uid() = user_id.
   */

  const {
    error,
  } = await supabase
    .from("service_history")
    .insert({
      user_id:
        userId,

      vehicle:
        record.vehicle,

      service_date:
        record.date,

      odometer:
        record.odometer,

      service_type:
        record.serviceType,

      workshop:
        record.serviceCenter,

      cost:
        record.amount,

      notes:
        record.notes,

      attachment:
        record.attachment,
    });


  if (error) {
    throw error;
  }
}


/* =========================================================
   UPDATE SERVICE RECORD
   ========================================================= */


export async function updateServiceRecord(
  record: ServiceRecord
) {
  const userId =
    await getCurrentUserId();


  /*
   * IMPORTANT:
   *
   * The user_id condition ensures that the application
   * only attempts to update the authenticated user's
   * own record.
   *
   * PostgreSQL RLS independently enforces the same rule.
   *
   * Therefore a family member cannot update another
   * family member's service record.
   */

  const {
    error,
  } = await supabase
    .from("service_history")
    .update({
      vehicle:
        record.vehicle,

      service_date:
        record.date,

      odometer:
        record.odometer,

      service_type:
        record.serviceType,

      workshop:
        record.serviceCenter,

      cost:
        record.amount,

      notes:
        record.notes,

      attachment:
        record.attachment,
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
   DELETE SERVICE RECORD
   ========================================================= */


export async function deleteServiceRecord(
  id: number
) {
  const userId =
    await getCurrentUserId();


  /*
   * Only the creator/owner can delete the record.
   *
   * Family SELECT access does not grant DELETE access.
   */

  const {
    error,
  } = await supabase
    .from("service_history")
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
   RESTORE SERVICE RECORDS
   ========================================================= */


export async function restoreServiceRecords(
  records: Omit<
    ServiceRecord,
    "id" | "user_id"
  >[]
) {
  if (
    records.length === 0
  ) {
    return;
  }


  const userId =
    await getCurrentUserId();


  /*
   * Restored records belong to the currently
   * authenticated user.
   *
   * We deliberately do NOT restore another
   * user's user_id from the backup.
   */

  const {
    error,
  } = await supabase
    .from("service_history")
    .insert(
      records.map(
        (record) => ({
          user_id:
            userId,

          vehicle:
            record.vehicle,

          service_date:
            record.date,

          odometer:
            record.odometer,

          service_type:
            record.serviceType,

          workshop:
            record.serviceCenter,

          cost:
            record.amount,

          notes:
            record.notes,

          attachment:
            record.attachment,
        })
      )
    );


  if (error) {
    throw error;
  }
}