import { supabase } from "../lib/supabase";
import type { ServiceRecord } from "../types/service";
import { getCurrentUserId } from "./authHelper";

export async function getServiceRecords(): Promise<ServiceRecord[]> {
    const userId = await getCurrentUserId();
  
    const { data, error } = await supabase
      .from("service_history")
      .select("*")
      .eq("user_id", userId)
      .order("service_date", { ascending: false });
  
    if (error) throw error;
  
    return (data ?? []).map((row) => ({
      id: row.id,
      vehicle: row.vehicle,
      date: row.service_date,
      odometer: row.odometer,
      serviceType: row.service_type,
      serviceCenter: row.workshop,
      amount: Number(row.cost ?? 0),
      notes: row.notes ?? "",
      attachment: row.attachment ?? "",
    }));
  }


export async function addServiceRecord(record: Omit<ServiceRecord, "id">) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("service_history")
    .insert({
      user_id: userId,
      vehicle: record.vehicle,
      service_date: record.date,
      odometer: record.odometer,
      service_type: record.serviceType,
      workshop: record.serviceCenter,
      cost: record.amount,
      notes: record.notes,
      attachment: record.attachment,
    });

  if (error) throw error;
}

export async function updateServiceRecord(record: ServiceRecord) {
    const userId = await getCurrentUserId();
  
    const { error } = await supabase
      .from("service_history")
      .update({
        vehicle: record.vehicle,
        service_date: record.date,
        odometer: record.odometer,
        service_type: record.serviceType,
        workshop: record.serviceCenter,
        cost: record.amount,
        notes: record.notes,
        attachment: record.attachment,
      })
      .eq("id", record.id)
      .eq("user_id", userId);
  
    if (error) throw error;
  }

  export async function deleteServiceRecord(id: number) {
    const userId = await getCurrentUserId();
  
    const { error } = await supabase
      .from("service_history")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
  
    if (error) throw error;
  }

export async function restoreServiceRecords(
  records: Omit<ServiceRecord, "id">[]
) {
  if (records.length === 0) return;

  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("service_history")
    .insert(
      records.map((record) => ({
        user_id: userId,
        vehicle: record.vehicle,
        service_date: record.date,
        odometer: record.odometer,
        service_type: record.serviceType,
        workshop: record.serviceCenter,
        cost: record.amount,
        notes: record.notes,
        attachment: record.attachment,
      }))
    );

  if (error) throw error;
}