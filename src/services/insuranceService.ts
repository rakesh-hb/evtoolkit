import { getCurrentUserId } from "./authHelper";
import { supabase } from "../lib/supabase";
import type { InsuranceRecord } from "../types/insurance";


/* =========================================================
   GET INSURANCE
   ========================================================= */

export async function getInsurance(): Promise<
  InsuranceRecord[]
> {
  /*
   * Do NOT filter by the current user here.
   *
   * RLS now allows:
   *   - the user's own insurance records
   *   - insurance records belonging to family members
   *
   * PostgreSQL/RLS decides which rows are actually returned.
   */

  const {
    data,
    error,
  } = await supabase
    .from("insurance")
    .select("*")
    .order(
      "expiry_date",
      {
        ascending: true,
      }
    );


  if (error) {
    throw error;
  }


  return (data ?? []) as InsuranceRecord[];
}


/* =========================================================
   ADD INSURANCE
   ========================================================= */

export async function addInsurance(
  policy: Omit<
    InsuranceRecord,
    "id" | "user_id"
  >
) {
  const userId =
    await getCurrentUserId();


  /*
   * New insurance records always belong
   * to the currently authenticated user.
   */

  const {
    error,
  } = await supabase
    .from("insurance")
    .insert([
      {
        ...policy,

        user_id:
          userId,
      },
    ]);


  if (error) {
    throw error;
  }
}


/* =========================================================
   UPDATE INSURANCE
   ========================================================= */

export async function updateInsurance(
  id: number,
  policy: InsuranceRecord
) {
  const userId =
    await getCurrentUserId();


  /*
   * Keep an explicit owner-only update condition.
   *
   * RLS independently enforces:
   *
   * auth.uid() = user_id
   *
   * so a family member cannot update
   * somebody else's insurance record.
   */

  const updatedPolicy = {
    vehicle:
      policy.vehicle,

    company:
      policy.company,

    policy_number:
      policy.policy_number,

    policy_type:
      policy.policy_type,

    start_date:
      policy.start_date,

    expiry_date:
      policy.expiry_date,

    premium:
      policy.premium,

    idv:
      policy.idv,

    addons:
      policy.addons,

    agent:
      policy.agent,

    contact_number:
      policy.contact_number,

    notes:
      policy.notes,

    attachment:
      policy.attachment,
  };


  const {
    error,
  } = await supabase
    .from("insurance")
    .update(
      updatedPolicy
    )
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
   DELETE INSURANCE
   ========================================================= */

export async function deleteInsurance(
  id: number
) {
  const userId =
    await getCurrentUserId();


  /*
   * Only the owner can delete.
   *
   * Family SELECT access does NOT grant
   * DELETE access.
   */

  const {
    error,
  } = await supabase
    .from("insurance")
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