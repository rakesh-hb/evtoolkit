import { supabase } from "../lib/supabase";
import type { ServiceRecord } from "../types/service";

export async function getServiceRecords(): Promise<ServiceRecord[]> {
  const { data, error } = await supabase
    .from("service_history")
    .select("*")
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
  const { error } = await supabase.from("service_history").insert({
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
    .eq("id", record.id);

  if (error) throw error;
}

export async function deleteServiceRecord(id: number) {
  const { error } = await supabase
    .from("service_history")
    .delete()
    .eq("id", id);

  if (error) throw error;
}