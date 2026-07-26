import { getCurrentUserId } from "./authHelper";
import { supabase } from "../lib/supabase";
import type { InsuranceRecord } from "../types/insurance";

export async function getInsurance() {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("insurance")
    .select("*")
    .eq("user_id", userId)
    .order("expiry_date", { ascending: true });

  if (error) throw error;

  return data;
}

export async function addInsurance(policy: Omit<InsuranceRecord, "id">) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("insurance")
    .insert([
      {
        ...policy,
        user_id: userId,
      },
    ]);

  if (error) throw error;
}

export async function updateInsurance(
  id: number,
  policy: InsuranceRecord
) {
  const userId = await getCurrentUserId();

  const updatedPolicy = {
    vehicle: policy.vehicle,
    company: policy.company,
    policy_number: policy.policy_number,
    policy_type: policy.policy_type,
    start_date: policy.start_date,
    expiry_date: policy.expiry_date,
    premium: policy.premium,
    idv: policy.idv,
    addons: policy.addons,
    agent: policy.agent,
    contact_number: policy.contact_number,
    notes: policy.notes,
    attachment: policy.attachment,
  };

  const { error } = await supabase
    .from("insurance")
    .update(updatedPolicy)
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function deleteInsurance(id: number) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("insurance")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}