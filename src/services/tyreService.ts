import { supabase } from "../lib/supabase";
import type { TyreRecord } from "../types/tyre";

export type TyreInput = Omit<
  TyreRecord,
  "id" | "createdAt" | "updatedAt"
>;

function mapDbToTyre(row: any): TyreRecord {
  return {
    id: row.id,

    brand: row.brand,
    model: row.model,
    size: row.size,

    purchaseDate: row.purchase_date,
    installDate: row.install_date,

    odometer: row.odometer,

    cost: Number(row.cost),

    dealer: row.dealer,

    warrantyMonths: row.warranty_months,

    receipt: row.receipt ?? "",
    notes: row.notes ?? "",

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapInputToDb(record: TyreInput) {
  return {
    brand: record.brand,
    model: record.model,
    size: record.size,

    purchase_date: record.purchaseDate,
    install_date: record.installDate,

    odometer: record.odometer,

    cost: record.cost,

    dealer: record.dealer,

    warranty_months: record.warrantyMonths,

    receipt: record.receipt,
    notes: record.notes,
  };
}

export async function getTyres(): Promise<TyreRecord[]> {
  const { data, error } = await supabase
    .from("tyres")
    .select("*")
    .order("install_date", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(mapDbToTyre);
}

export async function addTyre(record: TyreInput) {
  const { error } = await supabase
    .from("tyres")
    .insert([
      {
        ...mapInputToDb(record),
      },
    ]);

  if (error) throw error;
}

export async function updateTyre(record: TyreRecord) {
  const { error } = await supabase
    .from("tyres")
    .update({
      ...mapInputToDb(record),
      updated_at: new Date().toISOString(),
    })
    .eq("id", record.id);

  if (error) throw error;
}

export async function deleteTyre(id: number) {
  const { error } = await supabase
    .from("tyres")
    .delete()
    .eq("id", id);

  if (error) throw error;
}